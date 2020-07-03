/*\
title: $:/plugins/ceebee/chatbot/macros/chatbot.js
type: application/javascript
module-type: widget
created: 20180122042435147
creator: CeeBeeToo

Action widget to run a chat bot discussion
\*/
(function(){

/*jslint node: true, browser: true */
/*global $tw: false */
/* Initial Section - Standard Widget inheritance and setup of libraries  */
"use strict";

var Widget = require("$:/core/modules/widgets/widget.js").widget;
var RiveScript = require('$:/plugins/ceebee/chatbot/library/rivescript.min.js');

var ChatBotWidget = function(parseTreeNode,options) { this.initialise(parseTreeNode,options); };
ChatBotWidget.prototype = new Widget();

ChatBotWidget.prototype.render = function(parent,nextSibling) { this.computeAttributes(); this.execute(); };

/*
Custom Section to
 -  Compute the internal state of the widget and all initial parameters   ( via execute function)
 -  Refresh the widget by ensuring our attributes are up to date          ( via refresh function)
 -  Invoke the action associated with this widget                            ( via  invokeAction function)

*/
ChatBotWidget.prototype.execute = function() {
        this.filter =this.getAttribute("filter","[[]]");
        this.list = this.wiki.filterTiddlers(this.filter, this);

        if( $tw.bots == undefined ) { $tw.bots = [] };

        if ( $tw.bots[this.filter] == undefined ){
                this.bot = new RiveScript();
                this.loadChatBot();
                $tw.bots[this.filter] = this.bot;
        }else{ this.bot = $tw.bots[this.filter] };

        this.userMsgTitle = this.getAttribute("user");
        this.dialoguePrefix = this.getAttribute("dialogue");
};

ChatBotWidget.prototype.refresh = function(changedTiddlers) {
        var changedAttributes = this.computeAttributes();
        if($tw.utils.count(changedAttributes) > 0) {
               this.refreshSelf();
               return true;
        }
        return this.refreshChildren(changedTiddlers);
};

ChatBotWidget.prototype.invokeAction = function(triggeringWidget,event) {

        var userMsg= this.wiki.getTiddlerText(this.userMsgTitle);
        if ( userMsg != "" && userMsg != null ) {
                this.addToDialogue("user", userMsg);

                var reply = this.bot.reply("local-user", userMsg );
                var thisObj = this;

                setTimeout(function(){ thisObj.addToDialogue ( "bot",reply); }, 500 + Math.random() *2000 );
        };
        return true; // Action was invoked
};

/*
Create the chatbot and load the dialoge templates ;
*/
ChatBotWidget.prototype.loadChatBot = function(){

try{
        for(var t=0; t<this.list.length; t++) {
                var code = this.wiki.getTiddlerText(this.list[t]);
		this.bot.parse(this.list[t], code, function(error) {
			 var response = " My brian hurts ! <br/>Error in your RiveScript code:<br/>" ;
 			 alert(error);
			 this.addToDialogue("bot", response);
		});
        }
	this.bot.sortReplies();
}catch(error){
         this.addToDialogue("bot", " My brian hurts bad  ! <br/>Error in loading :<br/>" + error);
}
}

ChatBotWidget.prototype.addToDialogue = function( from, msg ){

	var title = this.wiki.generateNewTitle(this.dialoguePrefix);
        var creationFields = this.wiki.getCreationFields();
	var  modificationFields = this.wiki.getModificationFields();
 	var tiddler = new $tw.Tiddler(creationFields, {from: from, text: msg, title : title},modificationFields);
        this.wiki.addTiddler(tiddler);
}

exports["action-chat"] = ChatBotWidget ;

})();
