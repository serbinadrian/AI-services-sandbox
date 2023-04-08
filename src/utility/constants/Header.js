const tabs = [
  { title: "AI Marketplace", link: "https://beta.singularitynet.io/" },
  { title: "Get Started", link: "https://github.com/serbinadrian/AI-services-sandbox" }
];

const dropdowns = [
  {
    label: "Resources",
    list: [
      { label: "Guidelines", link: "https://drive.google.com/drive/folders/1IFsHsrfMSrQGrXtGkFsj5YIV_chEjlmC", newTab: true },
      { label: "Checklist", link: "https://docs.google.com/spreadsheets/d/1fNg-RMtVJQT4rb43MpeyEjCvHV6nI7W5GaEF0XDR04Y", newTab: true },
      { label: "Protos", link: "https://github.com/serbinadrian/AI-sevices-UI/tree/dev/proto", newTab: true },
      { label: "UI_archives", link: "https://drive.google.com/drive/folders/1KpowEtTnp6KSUibSerfjfAPoHBzfvnbM", newTab: true },
    ],
  },
  {
    label: "Repositories",
    list: [
      { label: "Iktina repo", link: " ", newTab: true },
      { label: "Services repo", link: "https://github.com/serbinadrian/AI-sevices-UI", newTab: true },
      { label: "Sandbox repo", link: "https://github.com/serbinadrian/AI-services-sandbox", newTab: true },
    ]
  }
];

export const NavData = {
  tabs,
  dropdowns,
};
