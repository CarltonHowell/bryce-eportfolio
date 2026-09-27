
export interface Subject {
  n: string;
  title: string;
  blurb: string;
  /** Where the subject sits in the Australian Curriculum (Yrs 7–10) and QCAA senior syllabuses (Yrs 11–12). */
  alignment: string;
}

/**
 * Queensland implements the Australian Curriculum v9.0 for Prep–Year 10 and QCAA syllabuses for Years 11–12.
 * HPE content description codes were checked against QCAA's AC v9 alignment documents; re-verify everything
 * on australiancurriculum.edu.au and qcaa.qld.edu.au before launch.
 */
export const subjects: Subject[] = [
  {
    n: '01',
    title: 'Physical Education',
    blurb: 'Movement, strategy and lifelong health - what the body does, and why it matters.',
    alignment: 'AC v9.0 HPE · AC9HP8M03 · AC9HP10M04 · QCAA Physical Education',
  },
  {
    n: '02',
    title: 'Outdoor Education',
    blurb: 'Bushcraft, navigation and risk management - students plan and lead real expeditions.',
    alignment: 'AC v9.0 HPE · AC9HP10M05 · Sustainability · QCAA Sport & Recreation',
  },
  {
    n: '03',
    title: 'English',
    blurb: 'Reading closely, writing with purpose and speaking with conviction.',
    alignment: 'AC v9.0 English · Language, Literature, Literacy · QCAA English',
  },
  {
    n: '04',
    title: 'Biology',
    blurb: 'From cells to ecosystems - field work and the science of how bodies perform.',
    alignment: 'AC v9.0 Science · Biological sciences · QCAA Biology',
  },
];
