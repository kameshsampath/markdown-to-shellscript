var fs = require("fs");

import { markdownToShellScript } from "./parser";

const commandLineUsage = require("command-line-usage");
const commandLineArgs = require("command-line-args");

const optionDefinitions = [
  {
    name: "help",
    alias: "h",
    type: Boolean,
    description: "Display this usage guide."
  },
  {
    name: "src",
    type: String,
    alias: "s",
    description: "The input files to process",
    typeLabel: "<markdown file>"
  }
];
const options = commandLineArgs(optionDefinitions);

const isValid = options.help || (options.src && options.src.length > 0);

if (!isValid) {
  const usage = commandLineUsage([
    {
      header: "Generate Test Script from Markdown",
      content: "Generates test script from markdown."
    },
    {
      header: "Options",
      optionList: optionDefinitions
    },
    {
      content:
        "Project home: {underline https://github.com/kameshsampath/markdown-to-shellscript}"
    }
  ]);
  console.log(usage);
} else {
  if (fs.existsSync(options.src)) {
    markdownToShellScript(options.src);
  } else {
    console.log(
      `File ${options.src} does not exist, please provide a valid file`
    );
  }
}
