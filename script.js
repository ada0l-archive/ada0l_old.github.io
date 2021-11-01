// why is there no such function in vanila?
function createElement(tag_name, params) {
  let element = document.createElement(tag_name);
  if (params["classes"] != undefined) {
    for (class_name of params["classes"]) {
      element.classList.add(class_name);
    }
  }
  if (params["content"] != undefined) {
    for (inner_element of params["content"]) {
      element.append(inner_element);
    }
  }
  if (params["attrs"] != undefined) {
    for (let key in params["attrs"]) {
      element[key] = params["attrs"][key];
    }
  }
  return element;
}

class ConsolePrinter {
  static printCopyOfPrompt(console_, command) {
    let row = createElement("div", {
      classes: ["row"],
      content: [
        createElement("div", {
          classes: console_.lastCommandError ? ["symbol", "error"] : ["symbol"],
          content: ["$"],
        }),
        createElement("pre", {
          content: " ",
        }),
        createElement("div", {
          content: [`${command}`],
        }),
      ],
    });
    console_.output.append(row);
  }

  static printLine(console_, str) {
    let row = createElement("div", {
      classes: ["row"],
      content: [str],
    });
    console_.output.append(row);
  }

  static printElements(console_, arr) {
    let row = createElement("div", {
      classes: ["row"],
      content: arr,
    });
    console_.output.append(row);
  }

  static printLines(console_, arr) {
    for (let line in arr) {
      ConsolePrinter.printLine(console_, arr[line]);
    }
  }

  static getSeparator() {
    let separator = createElement("div", {
      classes: ["separator"],
    });
    return separator;
  }

  static printProject(console_, label, url, describe) {
    let link = createElement("a", {
      content: [label],
    });
    link.href = url;
    let separator = createElement("div", {
      classes: ["separator"],
    });
    let row = createElement("div", {
      classes: ["row"],
      content: [separator, link, separator, describe],
    });
    console_.output.append(row);
  }
}

class Console {
  constructor(console_, info_text, projects_list) {
    this.lastCommandError = false;

    this.output = console_.querySelector(".output");
    this.promptSymbol = console_.querySelector(".prompt > .symbol");

    this.promptInput = console_.querySelector(".prompt > input");
    this.promptInput.value = "";
    this.promptInput.focus();
    this.info_text = info_text;
    this.projects_list = projects_list;

    document.querySelector("body").addEventListener("click", () => {
      this.promptInput.focus();
    });

    this.promptInput.addEventListener("keyup", (e) => {
      if (e.key === "Enter" || e.keyCode === 13) {
        this.doCommand(this.promptInput.value);

        // scroll to bottom of page
        this.promptInput.scrollIntoView(false);

        // clear input
        this.promptInput.value = "";

        if (this.lastCommandError) {
          this.promptSymbol.classList.add("error");
        } else {
          this.promptSymbol.classList.remove("error");
        }
      }
    });
  }

  doCommand(command) {
    const COMMANDS = {
      help: () => {
        ConsolePrinter.printLines(this, [
          "GNU Bash, version 3000",
          "My developer is very lazy, so I'm almost useless ",
          "Available commands: ",
          "help     - show this message",
          "projects - show info about projects",
          "info     - show info about developer",
        ]);
        this.lastCommandError = false;
      },
      clear: () => {
        this.output.innerHTML = "";
        this.lastCommandError = false;
      },
      info: () => {
        ConsolePrinter.printLine(this, this.info_text);
        this.lastCommandError = false;
      },
      projects: () => {
        for (let project of this.projects_list) {
          ConsolePrinter.printElements(this, [
            createElement("a", {
              content: [project.name],
              attrs: {
                href: project.href,
              },
            }),
            createElement("pre", {
              content: [" - "],
            }),
            createElement("p", {
              content: [`${project.describe}`],
            }),
          ]);
        }
        this.lastCommandError = false;
      },
    };

    ConsolePrinter.printCopyOfPrompt(this, command);
    if (COMMANDS[command] != undefined) {
      COMMANDS[command]();
    } else {
      ConsolePrinter.printLine(this, `${command}: command not found`);
      this.lastCommandError = true;
    }
  }
}

let my_console = new Console(
  document.querySelector(".console"),
  "I am programmer. And sometimes I do some stuff just for fun.",
  [
    {
      name: "Amigo",
      href: "https://github.com/ada0l/amigo",
      describe: "Telegram bot that helps automate the secret santa event",
    },
    {
      name: "Dark Univer",
      href: "https://github.com/ada0l/dark_univer",
      describe: "Extension embedding a dark theme on the site univer.dvfu.ru",
    },
    {
      name: "Just-Colors",
      href: "https://github.com/andreyvpng/just-colors",
      describe:
        "Just Colors is easy and flexible way to create themes for all programms using built-in or custom color scheme.",
    },
    {
      name: "dotmanager",
      href: "https://github.com/andreyvpng/dotmanager",
      describe: "dotmanager is bash script for easy manage your dotfiles",
    },
    {
      name: "Memoria",
      href: "https://github.com/andreyvpng/memoria",
      describe:
        "Memoria is memory game for web. The player must remember the location of the cards and find a match.",
    },
    {
      name: "typing.js",
      href: "https://github.com/andreyvpng/typing.js",
      describe:
        "Memoria is memory game for web. The player must remember the location of the cards and find a match.",
    },
    {
      name: "no-authentication-in-popular-website",
      href: "https://github.com/andreyvpng/no-authentication-in-popular-website",
      describe:
        "Add-on makes it possible to visit pornhub without authentication via VK ",
    },
    {
      name: "School 11",
      href: "https://andreyvpng.github.io/school11_new/",
      describe:
        "A website that I made for a school, but that never went deploy lol",
    },
  ]
);
