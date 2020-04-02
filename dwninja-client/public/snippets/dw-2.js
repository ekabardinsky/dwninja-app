ace.define("ace/snippets/dw-2",["require","exports","module"], function(require, exports, module) {
"use strict";

exports.snippetText = "## MimeTypes\n\
# json\n\
snippet application/json\n\
	application/json\n\
# xml\n\
snippet application/xml\n\
	application/xml\n\
# csv\n\
snippet application/csv\n\
	application/csv\n\
# java\n\
snippet application/java\n\
	application/java\n\
## functions && vars\n\
# Function\n\
snippet fun\n\
	fun ${1?:function_name}(${2:argument}) = ${3:// body...}\n\
# Var\n\
snippet var\n\
	var ${1?:variable_name} = ${2:// body...}\n\
";
exports.scope = "dw-2";
});

