import { Plugin, WorkspaceLeaf } from "obsidian";

export default class Hyphenation extends Plugin {
  clearLang = () => {
    // clear all lang elements from all active leafs
    for (const el of this.elements(document.body)) {
      el.removeAttribute("lang");
    }
  };

  elements = (containerEl: HTMLElement): Element[] => {
    const source = containerEl.getElementsByClassName("markdown-source-view");
    const reading = containerEl.getElementsByClassName("markdown-reading-view");

    return Array.from(source).concat(Array.from(reading));
  };

  activeLeafChange = (leaf: WorkspaceLeaf | null) => {
    if (!leaf) {
      return;
    }

    // since we are responding to an active leaf change, get the active file
    // which should be open in the active leaf
    const activeFile = this.app.workspace.getActiveFile();
    if (!activeFile || activeFile.extension != "md") {
      return;
    }

    const cache = this.app.metadataCache.getFileCache(activeFile);

    // use the language from the frontmatter, or the default language
    const lang = cache?.frontmatter?.["lang"] || navigator.language;

    this.setLang(leaf.view.containerEl, lang);
  };

  setLang = (containerEl: HTMLElement, lang: string) => {
    for (const el of this.elements(containerEl)) {
      el.setAttribute("lang", lang);
    }
  };

  async onload() {
    this.app.workspace.onLayoutReady(() => {
      this.registerEvent(
        this.app.workspace.on("active-leaf-change", this.activeLeafChange)
      );
    });
  }

  onunload() {
    this.clearLang();
  }
}
