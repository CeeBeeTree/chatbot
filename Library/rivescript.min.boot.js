/*\
title: $:/plugins/ceebee/chatbot/library/rivescript.min.boot.js
type: application/javascript
module-type: startup
created: 20180124090121831
creator: CeeBeeToo

Load the RiveScript library on startup

\*/

exports.startup = function() {
$tw.modules.execute('$:/plugins/ceebee/chatbot/library/rivescript.min.js');
}
