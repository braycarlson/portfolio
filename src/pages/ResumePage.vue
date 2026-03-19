<template>
    <div>
        <div class="resume-header">
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
import { assert } from '@/utils/assert';

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
.resume-header {
    position: relative;
    z-index: 1;
    padding: 8rem 48px 0;
}

.resume-header-inner {
    max-width: 1000px;
    margin: 0 auto;
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
    .resume-header {
        padding: 8rem 32px 0;
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
