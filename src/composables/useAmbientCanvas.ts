import { onMounted, onUnmounted, type Ref } from 'vue';
import { useEventListener, useMediaQuery } from '@vueuse/core';

const VERTEX_SOURCE = `
    attribute vec2 a_pos;
    varying vec2 v_uv;

    void main() {
        v_uv = a_pos * 0.5 + 0.5;
        gl_Position = vec4(a_pos, 0.0, 1.0);
    }
`;

const FRAGMENT_SOURCE = `
    precision highp float;
    varying vec2 v_uv;
    uniform float u_time;
    uniform vec2 u_res;

    float hash(vec2 p) {
        vec3 p3 = fract(vec3(p.xyx) * 0.1031);
        p3 += dot(p3, p3.yzx + 33.33);
        return fract((p3.x + p3.y) * p3.z);
    }

    void main() {
        vec2 uv = vec2(v_uv.x, 1.0 - v_uv.y);
        float aspect = u_res.x / u_res.y;
        vec3 col = vec3(0.065, 0.065, 0.072);

        float t = u_time * 0.001;

        float t1 = t * 6.283185 / 22.0;
        vec2 c1 = vec2(0.65 + sin(t1) * 0.05, 0.7 + cos(t1) * 0.04);
        float d1 = length((uv - c1) * vec2(aspect, 1.0));
        col += vec3(0.2, 0.14, 0.3) * smoothstep(0.85, 0.0, d1) * 0.14;

        float t2 = t * 6.283185 / 28.0;
        vec2 c2 = vec2(0.25 + sin(t2) * 0.04, 0.2 + cos(t2) * 0.03);
        float d2 = length((uv - c2) * vec2(aspect, 1.0));
        col += vec3(0.14, 0.13, 0.25) * smoothstep(0.6, 0.0, d2) * 0.1;

        float t3 = t * 6.283185 / 18.0;
        vec2 c3 = vec2(0.5 + sin(t3) * 0.03, 0.45 + cos(t3) * 0.03);
        float d3 = length((uv - c3) * vec2(aspect, 1.0));
        col += vec3(0.16, 0.13, 0.2) * smoothstep(0.45, 0.0, d3) * 0.07;

        float n = (hash(gl_FragCoord.xy + fract(u_time)) + hash(gl_FragCoord.xy * 1.7 - fract(u_time * 0.5)) - 1.0) / 255.0;
        col += n;

        gl_FragColor = vec4(col, 1.0);
    }
`;

const QUAD_VERTICES = new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]);
const QUAD_VERTEX_COUNT = 4;

function compileShader(
    context: WebGLRenderingContext,
    type: number,
    source: string,
): WebGLShader | null {
    const shader = context.createShader(type);
    if (!shader) return null;

    context.shaderSource(shader, source);
    context.compileShader(shader);

    return shader;
}

export function useAmbientCanvas(canvas: Ref<HTMLCanvasElement | null>): void {
    let context: WebGLRenderingContext | null = null;
    let program: WebGLProgram | null = null;
    let animationId = 0;
    let timeUniform: WebGLUniformLocation | null = null;

    const reducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)');

    function render(time: number): void {
        if (!context || !timeUniform) return;

        context.uniform1f(timeUniform, time);
        context.drawArrays(context.TRIANGLE_STRIP, 0, QUAD_VERTEX_COUNT);

        animationId = requestAnimationFrame(render);
    }

    function resize(): void {
        const element = canvas.value;
        if (!element || !context || !program) return;

        const devicePixelRatio = window.devicePixelRatio || 1;

        element.width = Math.round(window.innerWidth * devicePixelRatio);
        element.height = Math.round(window.innerHeight * devicePixelRatio);

        context.viewport(0, 0, element.width, element.height);

        const resolutionUniform = context.getUniformLocation(program, 'u_res');
        if (!resolutionUniform) return;

        context.uniform2f(resolutionUniform, element.width, element.height);
    }

    function initialize(): void {
        const element = canvas.value;
        if (!element) return;

        context = element.getContext('webgl2') as WebGLRenderingContext
            || element.getContext('webgl') as WebGLRenderingContext;

        if (!context) return;

        program = context.createProgram();
        if (!program) return;

        const vertexShader = compileShader(context, context.VERTEX_SHADER, VERTEX_SOURCE);
        const fragmentShader = compileShader(context, context.FRAGMENT_SHADER, FRAGMENT_SOURCE);
        if (!vertexShader || !fragmentShader) return;

        context.attachShader(program, vertexShader);
        context.attachShader(program, fragmentShader);
        context.linkProgram(program);
        context.useProgram(program);

        const buffer = context.createBuffer();
        if (!buffer) return;

        context.bindBuffer(context.ARRAY_BUFFER, buffer);
        context.bufferData(context.ARRAY_BUFFER, QUAD_VERTICES, context.STATIC_DRAW);

        const position = context.getAttribLocation(program, 'a_pos');
        if (position < 0) return;

        context.enableVertexAttribArray(position);
        context.vertexAttribPointer(position, 2, context.FLOAT, false, 0, 0);

        timeUniform = context.getUniformLocation(program, 'u_time');
        if (!timeUniform) return;

        resize();

        if (reducedMotion.value) {
            context.uniform1f(timeUniform, 0);
            context.drawArrays(context.TRIANGLE_STRIP, 0, QUAD_VERTEX_COUNT);
            return;
        }

        animationId = requestAnimationFrame(render);
    }

    useEventListener(window, 'resize', resize);

    useEventListener(canvas, 'webglcontextlost', (event: Event) => {
        event.preventDefault();
        cancelAnimationFrame(animationId);
        context = null;
        program = null;
        timeUniform = null;
    });

    useEventListener(canvas, 'webglcontextrestored', () => {
        initialize();
    });

    onMounted(() => {
        initialize();
    });

    onUnmounted(() => {
        cancelAnimationFrame(animationId);
    });
}
