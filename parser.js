var fs = require("fs");
const path = require("path");
var gfmRegex = require("gfm-code-block-regex");
var handlebars = require("handlebars");
var blocks = [];

//Generate a shell script from the shell/bash blocks
var source = `{{#each blocks}}
#####################################
# Function - {{@index}}
######################################
function fn_{{@index}}(){
    {{ encodeMyString code}}
}
{{/each}}

{{#each blocks}}
#####################################
# Call Function - {{@index}}
######################################
fn_{{@index}}
{{/each}}
`;
var template = handlebars.compile(source);
handlebars.registerHelper("encodeMyString", function(inputData) {
  return new handlebars.SafeString(inputData);
});

function markdownToShellScript(mdFile) {
  console.log("Generating script from markdown file ", mdFile);
  fs.readFile(mdFile, "utf8", function(err, text) {
    if (err === null) {
      var regex = gfmRegex();
      var match;
      while ((match = regex.exec(text))) {
        if ("shell" === match[3] || "bash" === match[3]) {
          blocks.push({
            start: match.index,
            end: match.index + match[1].length,
            lang: match[3],
            code: match[4],
            block: match[1]
          });
        }
      }
    } else {
      console.log(err);
    }
    //console.log(blocks);
    var result = template({ blocks: blocks });
    //console.log(result);
    if (!fs.existsSync("out")) {
      fs.mkdirSync("out");
    }
    fs.writeFileSync(`out/${path.basename(mdFile)}_script.sh`, result);
  });
}

module.exports = { markdownToShellScript };
