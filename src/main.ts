import { Plugin, TFile } from "obsidian";

export default class Hyphenation extends Plugin {
  clearLang = () => {
    for (const el of this.elements()) {
      el.removeAttribute("lang");
    }
  };

  elements = function (): Element[] {
    const preview = document.getElementsByClassName("markdown-preview-view");
    const live = document.getElementsByClassName("is-live-preview");

    return Array.from(preview).concat(Array.from(live));
  };

  fileOpen = (file: TFile | null) => {
    if (file) {
      const cache = this.app.metadataCache.getFileCache(file);

      // use the language from the frontmatter, or the default language
      const lang = cache?.frontmatter?.["lang"] || navigator.language;

      this.setLang(lang);
    }
  };

  setLang = (lang: string) => {
    for (const el of this.elements()) {
      el.setAttribute("lang", lang);
    }
  };

  async onload() {
    if (this.app.workspace.layoutReady) {
      this.setLang(navigator.language);
    } else {
      this.registerEvent(
        this.app.workspace.on("file-open", () =>
          this.setLang(navigator.language)
        )
      );
    }

    this.registerEvent(this.app.workspace.on("file-open", this.fileOpen));
  }

  onunload() {
    this.clearLang();
  }
}
