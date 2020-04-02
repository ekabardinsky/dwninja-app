ace.define("ace/snippets/dw-1",["require","exports","module"], function(require, exports, module) {
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
snippet function\n\
	function ${1?:function_name}(${2:argument}) ${3:// body...}\n\
# Var\n\
snippet var\n\
	var ${1?:variable_name} = ${2:// body...}\n\
## Common construction\n\
# using\n\
snippet using\n\
	using (${1?:variable_name} = ${2:argument}) { ${3:// body...} }\n\
# map\n\
snippet map\n\
	map (${1?:item}, ${2:index}) => { ${3:// body...} }\n\
# filter\n\
snippet filter\n\
	filter (${1?:item}) => { ${2:// body...} }\n\
# mapObject\n\
snippet mapObject\n\
	mapObject (\n\
	'$$': ${2:// body...} \n\
	)\n\
# pluck\n\
snippet pluck\n\
	pluck $$\n\
# reduce\n\
snippet reduce\n\
	reduce ($$ + $)\n\
# groupBy\n\
snippet groupBy\n\
	groupBy $.${1:field_name}\n\
# when\n\
snippet when\n\
	when (${1?:true}) otherwise ${2:// body...}\n\
# replace\n\
snippet replace\n\
	replace /(${1:\d+})/ with ${2:\"\"}\n\
# matches\n\
snippet matches\n\
	matches /(${1:\d+})/\n\
# startsWith\n\
snippet startsWith\n\
	startsWith ${1:\"\"}\n\
# endsWith\n\
snippet endsWith\n\
	endsWith ${1:\"\"}\n\
# default\n\
snippet default\n\
	default ${1?:null}\n\
## Cast values\n\
# object\n\
snippet as :object\n\
	as :object { class: \"${1}\" }\n\
# datetime\n\
snippet as :datetime\n\
	as :datetime { format: \"${1:YYYY-MM-dd HH-mm-ss}\" }\n\
# localdate\n\
snippet as :localdate\n\
	as :localdate { format: \"${1:YYYY-MM-dd HH-mm-ss}\" }\n\
# localdatetime\n\
snippet as :localdatetime\n\
	as :localdatetime { format: \"${1:YYYY-MM-dd HH-mm-ss}\" }\n\
# localtime\n\
snippet as :localtime\n\
	as :localtime { format: \"${1:HH-mm-ss}\" }\n\
# string\n\
snippet as :string\n\
	as :string { format: \"${1:YYYY-MM-dd HH-mm-ss}\" }\n\
";
exports.scope = "dw-1";
});
