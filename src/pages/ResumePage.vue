<template>
    <div>
        <section
            ref="element"
            class="section-shell section-shell--flush-bottom resume-header-shell"
            :class="{ visible }"
        >
            <div class="section-shell-inner section-shell-inner--narrow section-reveal-inner">
                <div class="resume-header-inner">
                    <div class="resume-downloads">
                        <button
                            class="btn btn-primary resume-download"
                            @click="download('/resume_of_brayden_carlson.pdf', 'resume_of_brayden_carlson.pdf')"
                        >
                            <IconDownload />
                            Resume
                        </button>
                        <button
                            class="btn btn-ghost resume-download"
                            @click="download('/cv_of_brayden_carlson.pdf', 'cv_of_brayden_carlson.pdf')"
                        >
                            <IconDownload />
                            CV
                        </button>
                    </div>
                </div>
            </div>
        </section>
        <ExperienceTimeline />
        <SkillGrid />
        <EducationCard />
        <PublicationList />
    </div>
</template>

<script setup lang="ts">
import EducationCard from '@/components/resume/EducationCard.vue';
import ExperienceTimeline from '@/components/resume/ExperienceTimeline.vue';
import PublicationList from '@/components/resume/PublicationList.vue';
import SkillGrid from '@/components/resume/SkillGrid.vue';
import IconDownload from '@/components/shared/icons/IconDownload.vue';
import { useScrollReveal } from '@/composables/useScrollReveal';
import { assert } from '@/utils/assert';

const { element, visible } = useScrollReveal();

async function download(href: string, filename: string): Promise<void> {
    assert(href.length > 0, 'download received an empty href');
    assert(filename.length > 0, 'download received an empty filename');

    const response = await fetch(href);
    const blob = await response.blob();
    const url = URL.createObjectURL(blob);

    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = filename;
    anchor.click();

    URL.revokeObjectURL(url);
}
</script>

<style scoped>
.resume-header-shell {
    padding-top: 8rem;
}

.resume-header-inner {
    display: flex;
    align-items: center;
    justify-content: flex-end;
}

.resume-downloads {
    display: flex;
    gap: 8px;
}

.resume-download {
    padding: 12px 24px;
    border-radius: 12px;
    font-size: 15px;
}

.resume-download .icon {
    font-size: 14px;
}

@media (max-width: 640px) {
    .resume-header-shell {
        padding-top: 8rem;
    }

    .resume-header-inner {
        flex-direction: column;
        gap: 1.5rem;
        text-align: center;
    }

    .resume-downloads {
        width: 100%;
    }

    .resume-download {
        flex: 1;
        justify-content: center;
    }
}
</style>
