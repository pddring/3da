var Assessment = function(subject) {
	this.descriptions = {
		difficulty: [
			"",
			"Step 1",
			"Step 2",
			"Step 3",
			"Step 4",
			"Step 5",
			"Step 6",
			"Step 7",
			"Step 8"
		],
		
		understanding:[
			"",
			"Not attempted",
			"None of this makes sense",
			"Not much of this makes sense",
			"Most of this makes sense",
			"All of this makes sense"
		],
		
		independence: [
			"",
			"Required 1:1 assistance all the time",
			"Required some practical assistance",
			"Required some verbal assistance",
			"Required some independent research",
			"Didn't require any assistance"
		]
	}
	
	var Student = function(firstname, surname) {
		this.firstname = firstname;
		this.surname = surname;
	};
	
	var Criteria = function(name) {
		this.name = name;
		this.understanding = 1;
		this.independence = 1;
		this.difficulty = 1;
	};
	
	var Topic = function(name) {
		this.name = name;
		this.criteria = [];
	};
	
	var a = this;
	this.topics = [];
	this.subject = subject;
	
	this.showEditTopic = function(topic) {
		var html = '<h1>Edit topic: ' + topic.name + '</h1>';
		html += '<label for="txt_topic_name">Name:</label><input type="text" id="txt_topic_name" value="' + topic.name + '"/>';
		html += '<label for="txt_topic_critera">Assessment criteria:</label><textarea id="txt_topic_criteria">';
		if(topic.criteria.length > 0){
			for(var i = 0; i < topic.criteria.length; i++) {
				html += topic.criteria[i].difficulty + " " + topic.criteria[i].name + "\n";
			}
		} else {
			html += 'Copy and paste the relevant "I can" statements in here';
		}
		html +='</textarea>';
		html += '<div><a data-role="button" data-icon="check" class="dlg_button" id="btn_dlg_ok">OK</a><a data-icon="delete" data-role="button" class="dlg_button" id="btn_dlg_cancel">Cancel</a></div>';
		
		$('#dlg').html(html).popup("open").trigger('create');
		
		$('.dlg_button').click(function(e) {
			switch(e.currentTarget.id) {
				case 'btn_dlg_ok':
					var lines = $('#txt_topic_criteria').val().split("\n");
					topic.criteria = [];
					for(var i = 0; i < lines.length; i++) {
						var line = lines[i].trim();
						if(line.length > 0) {
							var difficulty = line.match(/^(\d+)\s*(.*)$/);
							var c = new Criteria(line);
							if(difficulty) {
								c.difficulty = difficulty[1];
								c.name = difficulty[2];
							} 
							topic.criteria.push(c);
						}
					}
					a.updateTopics();
					
				case 'btn_dlg_cancel':
					$('#dlg').popup("close");
				break;
			}
		});
	}
	
	this.showGradeCriteria = function(criteria) {
		var html = '<h1>Edit grade</h1><div>';
		html += '<div class="criteria">' + criteria.name + '</div>';
		html += '<div data-role="fieldcontain" class="grade_area"><label for="slider_understanding"><h3>Depth of understanding:</h3></label><input class="slider_criteria" type="range" id="slider_understanding" value="' + criteria.understanding + '" min="1" max="5" /><div id="understanding_holder" class="rating_holder"></div></div>';
		html += '<div data-role="fieldcontain" class="grade_area"><label for="slider_independence"><h3>Independence:</h3></label><input class="slider_criteria" type="range" id="slider_independence" value="' + criteria.independence + '" min="1" max="5" /><div id="independence_holder" class="rating_holder"></div></div>';
		html += '<div><a data-icon="check" data-role="button" class="dlg_button" id="btn_dlg_ok">OK</a><a data-icon="delete" data-role="button" class="dlg_button" id="btn_dlg_cancel">Cancel</a></div></div>';

		$('#dlg').html(html).popup("open");
		$('#dlg').trigger('create');
		$("#dlg").popup("reposition", {positionTo: 'window'});
		
		var updateDefinitions = function(e) {
			var understanding = $('#slider_understanding').val();
			var independence = $('#slider_independence').val();
			$('#understanding_holder').html(a.descriptions.understanding[understanding]);
			$('#independence_holder').html(a.descriptions.independence[independence]);
		}
		
		updateDefinitions();
		$('.slider_criteria').on({'change':updateDefinitions});
		
		$('.dlg_button').click(function(e) {
			switch(e.currentTarget.id) {
				case 'btn_dlg_ok':
					criteria.understanding = $('#slider_understanding').val();
					criteria.independence = $('#slider_independence').val();
					a.updateTopics();
				case 'btn_dlg_cancel':
					$('#dlg').popup("close");
				break;
			}
		});
	};
	
	this.showAddTopic = function() {
		var html = '<h1>Add topic</h1><div><label for="txt_topic_name">Topic name:</label><input value="New topic" type="text" id="txt_topic_name"/>';
		html += '<div><a data-role="button" data-icon="check" class="dlg_button" id="btn_dlg_ok">OK</a><a data-icon="delete" data-role="button" class="dlg_button" id="btn_dlg_cancel">Cancel</a></div></div>';

		$('#dlg').html(html).trigger("create").popup("open");
		
		// ui
		$("#dlg").popup("reposition", {positionTo: 'window'});
		
		
		$('.dlg_button').click(function(e) {
			switch(e.currentTarget.id) {
				case 'btn_dlg_ok':
					var newName = $('#txt_topic_name').val();
					a.topics.push(new Topic(newName));
					a.updateTopics();
				case 'btn_dlg_cancel':
					$('#dlg').popup("close");
				break;
			}
		});
		
	}
	
	this.updateTopics = function() {
		var html = '<h1>' + a.subject + '</h1>';
		for(var i = 0 ; i < a.topics.length; i++) {
			html += '<div class="topic" id="topic_' + i + '">';
			html += '<h2>' + a.topics[i].name + '</h2>';
			html += '<a data-role="button" id="btn_edit_topic_' + i + '" class="btn_edit_topic" data-icon="gear">Edit topic ' + a.topics[i].name + '</a>';
			for(var j = 0; j < a.topics[i].criteria.length; j++) {
				var indWidth = a.topics[i].criteria[j].independence / 5 * 100;
				var undWidth = a.topics[i].criteria[j].understanding / 5 * 100;
				html += '<div class="criteria" id="criteria_' + i + '_' + j + '"><h3>' + a.descriptions.difficulty[a.topics[i].criteria[j].difficulty] + '</h3>' + a.topics[i].criteria[j].name + '<div><div class="criteria_indicator"><div class="indicator indicator_understanding"><div class="indicator_bar" id="ib_understanding_' + i + '_' + j + '" style="width:' + undWidth + '%"></div>Understanding: ' + a.topics[i].criteria[j].understanding + '</div><div class="indicator indicator_independence"><div class="indicator_bar" id="ib_independence_' + i + '_' + j + '" style="width:' + indWidth + '%"></div>Independence: ' + a.topics[i].criteria[j].independence + '</div></div><a data-role="button" data-icon="edit" data-role="button" class="btn_grade" id="btn_grade_' + i + '_' + j + '" data-inline="true">Grade</a></div></div>';
			}
			html += '</div>';
		}
		html += '<a id="btn_add_topic" data-role="button" class="btn" data-icon="plus">Add Topic</a>';
		$("#subject").html(html).trigger("create");
				
		// buttons
		
		$('.btn_grade').click(function(e){
			var data = e.currentTarget.id.split("_");
			var topicId = parseInt(data[2], 10);
			var criteriaId = parseInt(data[3], 10);
			var criteria = a.topics[topicId].criteria[criteriaId];
			
			a.showGradeCriteria(criteria);
		});
		
		$('.btn_edit_topic').click(function(e) {
			var topic = a.topics[parseInt(e.currentTarget.id.split("_")[3], 10)];
			
			a.showEditTopic(topic);
		});
		
		$('.btn').click(function(e) {
			switch(e.currentTarget.id) {
				case 'btn_add_topic':
					a.showAddTopic();
				break;
			}
		});
	};
	
	this.init = function() {
		a.topics = JSON.parse(atob("W3sibmFtZSI6IkhhcmR3YXJlLCBTb2Z0d2FyZSBhbmQgUHJvY2Vzc2luZyIsImNyaXRlcmlhIjpbeyJuYW1lIjoiSSB1bmRlcnN0YW5kIHdoZXRoZXIgY29tcHV0ZXJzIGhhdmUgaW50ZWxsaWdlbmNlIGFuZCB0aGF0IGEgY29tcHV0ZXIgY2FuIGRvIG5vdGhpbmcgdW5sZXNzIGEgcHJvZ3JhbSBpcyBleGVjdXRlZC4iLCJ1bmRlcnN0YW5kaW5nIjoxLCJpbmRlcGVuZGVuY2UiOjEsImRpZmZpY3VsdHkiOiIxIn0seyJuYW1lIjoiSSByZWNvZ25pemUgdGhhdCBhbGwgc29mdHdhcmUgZXhlY3V0ZWQgb24gZGlnaXRhbCBkZXZpY2VzIGhhcyBiZWVuIHByb2dyYW1tZWQuIiwidW5kZXJzdGFuZGluZyI6MSwiaW5kZXBlbmRlbmNlIjoxLCJkaWZmaWN1bHR5IjoiMSJ9LHsibmFtZSI6IkkgcmVjb2duaXplIHRoYXQgYSByYW5nZSBvZiBkaWZmZXJlbnQgZGlnaXRhbCBkZXZpY2VzIGFyZSBjb250cm9sbGVkIGJ5IGEgY29tcHV0ZXIgZS5nLiBkaWdpdGFsIFRWIGJveCwgdHJhZmZpYy1saWdodCBjb250cm9sbGVyLiIsInVuZGVyc3RhbmRpbmciOjEsImluZGVwZW5kZW5jZSI6MSwiZGlmZmljdWx0eSI6IjIifSx7Im5hbWUiOiJJIHJlY29nbml6ZSBhbmQgY2FuIHVzZSBhIHJhbmdlIG9mIGlucHV0IGFuZCBvdXRwdXQgcGVyaXBoZXJhbCBkZXZpY2VzIGUuZy4gcHJpbnRlciwgZ3JhcGhpY3MgdGFibGV0LCBzY2FubmVyLCBtaWNyb3Bob25lLiIsInVuZGVyc3RhbmRpbmciOjEsImluZGVwZW5kZW5jZSI6MSwiZGlmZmljdWx0eSI6IjIifSx7Im5hbWUiOiJJIHVuZGVyc3RhbmQgdGhhdCBhIGdlbmVyYWwgcHVycG9zZSBjb21wdXRlciBjYW4gYmUgbWFkZSB0byBkbyBkaWZmZXJlbnQgdGhpbmdzLCBkZXBlbmRpbmcgb24gdGhlIHByb2dyYW0gdGhhdCBpdCBpcyBydW5uaW5nLiIsInVuZGVyc3RhbmRpbmciOjEsImluZGVwZW5kZW5jZSI6MSwiZGlmZmljdWx0eSI6IjIifSx7Im5hbWUiOiJJIGtub3cgdGhhdCBjb21wdXRlcnMgY29sbGVjdCBkYXRhIGZyb20gZGlmZmVyZW50IGlucHV0IGRldmljZXMsIGluY2x1ZGluZyBzZW5zb3JzIGFuZCBhcHBsaWNhdGlvbiBzb2Z0d2FyZS4iLCJ1bmRlcnN0YW5kaW5nIjoxLCJpbmRlcGVuZGVuY2UiOjEsImRpZmZpY3VsdHkiOiIzIn0seyJuYW1lIjoiSSB1bmRlcnN0YW5kIHRoZSBkaWZmZXJlbmNlIGJldHdlZW4gaGFyZHdhcmUgYW5kIGFwcGxpY2F0aW9uIHNvZnR3YXJlIGFuZCB0aGVpciByb2xlcyB3aXRoaW4gYSBjb21wdXRlciBzeXN0ZW0gKHdoYXQgZWFjaCB0aGluZyBkb2VzKS4iLCJ1bmRlcnN0YW5kaW5nIjoxLCJpbmRlcGVuZGVuY2UiOjEsImRpZmZpY3VsdHkiOiIzIn0seyJuYW1lIjoiSSB1bmRlcnN0YW5kIHdoeSwgd2hlbiBhbmQgd2hlcmUgY29tcHV0ZXJzIGFyZSB1c2VkLiIsInVuZGVyc3RhbmRpbmciOjEsImluZGVwZW5kZW5jZSI6MSwiZGlmZmljdWx0eSI6IjQifSx7Im5hbWUiOiJJIGhhdmUgc2hvd24gYW4gYXdhcmVuZXNzIG9mIHRhc2tzIHRoYXQgYXJlIGJlc3QgY29tcGxldGVkIGJ5IGh1bWFucyBvciBjb21wdXRlcnMuIiwidW5kZXJzdGFuZGluZyI6MSwiaW5kZXBlbmRlbmNlIjoxLCJkaWZmaWN1bHR5IjoiNCJ9LHsibmFtZSI6IkkgdW5kZXJzdGFuZCB0aGUgbWFpbiBmdW5jdGlvbnMgdGhhdCBhbiBvcGVyYXRpbmcgc3lzdGVtIHBlcmZvcm1zLiIsInVuZGVyc3RhbmRpbmciOjEsImluZGVwZW5kZW5jZSI6MSwiZGlmZmljdWx0eSI6IjQifSx7Im5hbWUiOiJJIHJlY29nbml6ZSB0aGUgbWFpbiBpbnRlcm5hbCBwYXJ0cyBvZiBhIHNpbXBsZSBjb21wdXRlciBhcmNoaXRlY3R1cmUgYW5kIHdoYXQgdGhlIGRpZmZlcmVudCBwYXJ0cyBkby4iLCJ1bmRlcnN0YW5kaW5nIjoxLCJpbmRlcGVuZGVuY2UiOjEsImRpZmZpY3VsdHkiOiI1In0seyJuYW1lIjoiSSB1bmRlcnN0YW5kIHRoZSBtYWluIGlkZWEgb2YgdGhlIGZldGNoLWV4ZWN1dGUgY3ljbGUuIiwidW5kZXJzdGFuZGluZyI6MSwiaW5kZXBlbmRlbmNlIjoxLCJkaWZmaWN1bHR5IjoiNSJ9LHsibmFtZSI6IkkgaGF2ZSBzb21lIHByYWN0aWNhbCBleHBlcmllbmNlIG9mIGEgbG93LWxldmVsIHByb2dyYW1taW5nIGxhbmd1YWdlLiIsInVuZGVyc3RhbmRpbmciOjEsImluZGVwZW5kZW5jZSI6MSwiZGlmZmljdWx0eSI6IjgifSx7Im5hbWUiOiJJIHVuZGVyc3RhbmQgYW5kIGNhbiBleHBsYWluIG11bHRpLXRhc2tpbmcuIiwidW5kZXJzdGFuZGluZyI6MSwiaW5kZXBlbmRlbmNlIjoxLCJkaWZmaWN1bHR5IjoiOCJ9XX0seyJuYW1lIjoiUHJvYmxlbSBzb2x2aW5nIGFuZCBhbGdvcml0aG1zIiwiY3JpdGVyaWEiOlt7Im5hbWUiOiJJIHVuZGVyc3RhbmQgd2hhdCBhbiBhbGdvcml0aG0gaXMuIiwidW5kZXJzdGFuZGluZyI6MSwiaW5kZXBlbmRlbmNlIjoxLCJkaWZmaWN1bHR5IjoiMSJ9LHsibmFtZSI6IkkgY2FuIGV4cHJlc3MgYSBzZXF1ZW5jZSBvZiBhbGdvcml0aG1pYyBzdGVwcyB1c2luZyBzeW1ib2xzIGUuZy4gbWFrZSBhIHNpbXBsZSBmbG93Y2hhcnQuIiwidW5kZXJzdGFuZGluZyI6MSwiaW5kZXBlbmRlbmNlIjoxLCJkaWZmaWN1bHR5IjoiMSJ9LHsibmFtZSI6IkkgdW5kZXJzdGFuZCB0aGF0IGEgY29tcHV0ZXIgZm9sbG93cyBwcmVjaXNlIGluc3RydWN0aW9ucyB3aGVuIGV4ZWN1dGluZyBhIHByb2dyYW0uIiwidW5kZXJzdGFuZGluZyI6MSwiaW5kZXBlbmRlbmNlIjoxLCJkaWZmaWN1bHR5IjoiMSJ9LHsibmFtZSI6Ikkga25vdyB0aGF0IHVzZXJzIGNhbiBkZXZlbG9wIHRoZWlyIG93biBwcm9ncmFtcy4iLCJ1bmRlcnN0YW5kaW5nIjoxLCJpbmRlcGVuZGVuY2UiOjEsImRpZmZpY3VsdHkiOiIxIn0seyJuYW1lIjoiSSBjYW4gZGVzaWduIG15IG93biBzaW1wbGUgYWxnb3JpdGhtcyB1c2luZyBpdGVyYXRpb24gKGxvb3BzKSwgYW5kIHNlbGVjdGlvbiAoSUYgc3RhdGVtZW50cykuIiwidW5kZXJzdGFuZGluZyI6MSwiaW5kZXBlbmRlbmNlIjoxLCJkaWZmaWN1bHR5IjoiMiJ9LHsibmFtZSI6IkkgY2FuIHVzZSByZWFzb25pbmcgdG8gcHJlZGljdCB0aGUgb3V0Y29tZXMgb2YgYW4gYWxnb3JpdGhtICh3aGF0IHdpbGwgaGFwcGVuKS4gSSB1bmRlcnN0YW5kIHRoYXQgYWxnb3JpdGhtcyBhcmUgaW1wbGVtZW50ZWQgb24gZGlnaXRhbCBkZXZpY2VzIGFzIHByb2dyYW1zLiIsInVuZGVyc3RhbmRpbmciOjEsImluZGVwZW5kZW5jZSI6MSwiZGlmZmljdWx0eSI6IjIifSx7Im5hbWUiOiJJIHVuZGVyc3RhbmQgdGhhdCBhbGdvcml0aG1zIGNhbiBjb250YWluIGVycm9yc2FuZCBmbGF3cy4iLCJ1bmRlcnN0YW5kaW5nIjoxLCJpbmRlcGVuZGVuY2UiOjEsImRpZmZpY3VsdHkiOiIyIn0seyJuYW1lIjoiSSBoYXZlIGRlc2lnbmVkIHNvbHV0aW9ucyB0byBwcm9ibGVtcyAoYWxnb3JpdGhtcykgdGhhdCB1c2UgcmVwZXRpdGlvbiAobG9vcHMpIGFuZCBvbmUtb3ItdGhlLW90aGVyIGRlY2lzaW9ucyAoSUYtVEhFTi1FTFNFIHNlbGVjdGlvbikuIiwidW5kZXJzdGFuZGluZyI6MSwiaW5kZXBlbmRlbmNlIjoxLCJkaWZmaWN1bHR5IjoiMyJ9LHsibmFtZSI6IkkgaGF2ZSB1c2VkIGRpYWdyYW1zIHRvIGV4cHJlc3Mgc29sdXRpb25zLiIsInVuZGVyc3RhbmRpbmciOjEsImluZGVwZW5kZW5jZSI6MSwiZGlmZmljdWx0eSI6IjMifSx7Im5hbWUiOiJJIGhhdmUgdXNlZCByZWFzb25pbmcgdG8gcHJlZGljdCB3aGF0IHNob3VsZCBoYXBwZW4gaW4gZGlmZmVyZW50IGNpcmN1bXN0YW5jZXMvd2l0aCBkaWZmZXJlbnQgaW5wdXRzLiIsInVuZGVyc3RhbmRpbmciOjEsImluZGVwZW5kZW5jZSI6MSwiZGlmZmljdWx0eSI6IjMifSx7Im5hbWUiOiJJIGhhdmUgZGVzaWduZWQgc29sdXRpb25zIGJ5IGRlY29tcG9zaW5nIGEgcHJvYmxlbSBpbnRvIHBhcnRzLCBjcmVhdGluZyBhIHNvbHV0aW9uIGZvciBlYWNoIHBhcnQuIiwidW5kZXJzdGFuZGluZyI6MSwiaW5kZXBlbmRlbmNlIjoxLCJkaWZmaWN1bHR5IjoiNCJ9LHsibmFtZSI6IkkgcmVjb2duaXplIHRoYXQgdGhlcmUgY2FuIGJlIG1vcmUgdGhhbiBvbmUgd2F5IHRvIHNvbHZlIGEgcGFydGljdWxhciBwcm9ibGVtLiIsInVuZGVyc3RhbmRpbmciOjEsImluZGVwZW5kZW5jZSI6MSwiZGlmZmljdWx0eSI6IjQifSx7Im5hbWUiOiJJIHVuZGVyc3RhbmQgdGhhdCBpdGVyYXRpb24gbWVhbnMgcmVwZWF0aW5nIGEgcHJvY2VzcyAoc3VjaCBhcyB1c2luZyBhIGxvb3ApLiIsInVuZGVyc3RhbmRpbmciOjEsImluZGVwZW5kZW5jZSI6MSwiZGlmZmljdWx0eSI6IjUifSx7Im5hbWUiOiJJIHJlY29nbml6ZSB0aGF0IGRpZmZlcmVudCBhbGdvcml0aG1zIGV4aXN0IGZvciB0aGUgc2FtZSBwcm9ibGVtLiIsInVuZGVyc3RhbmRpbmciOjEsImluZGVwZW5kZW5jZSI6MSwiZGlmZmljdWx0eSI6IjUifSx7Im5hbWUiOiJJIGNhbiByZXByZXNlbnQgc29sdXRpb25zIHVzaW5nIGEgc3RydWN0dXJlZCBub3RhdGlvbiBlLmcuIHBzZXVkby1jb2RlIG9yIGZsb3djaGFydCBzeW1ib2xzLiIsInVuZGVyc3RhbmRpbmciOjEsImluZGVwZW5kZW5jZSI6MSwiZGlmZmljdWx0eSI6IjUifSx7Im5hbWUiOiJJIGNhbiBpZGVudGlmeSBzaW1pbGFyaXRpZXMgYW5kIGRpZmZlcmVuY2VzIGluIHNpdHVhdGlvbnMgYW5kIGNhbiB1c2UgdGhlc2UgdG8gc29sdmUgcHJvYmxlbXMgKEkgY2FuIHJlY29nbml6ZSBwYXR0ZXJucyBpbiB0aGluZ3MpLiIsInVuZGVyc3RhbmRpbmciOjEsImluZGVwZW5kZW5jZSI6MSwiZGlmZmljdWx0eSI6IjUifSx7Im5hbWUiOiJJIHVuZGVyc3RhbmQgdGhhdCBhIHJlY3Vyc2l2ZSBzb2x1dGlvbiB0byBhIHByb2JsZW0gcmVwZWF0ZWRseSBhcHBsaWVzIHRoZSBzYW1lIHNvbHV0aW9uIHRvIHNtYWxsZXIgaW5zdGFuY2VzIG9mIHRoZSBwcm9ibGVtIGUuZy4gZHJhd2luZyBhIGZyYWN0YWwgY3VydmUsIHNlYXJjaGluZyB0aHJvdWdoIGRhdGEuIiwidW5kZXJzdGFuZGluZyI6MSwiaW5kZXBlbmRlbmNlIjoxLCJkaWZmaWN1bHR5IjoiNSJ9LHsibmFtZSI6IkkgcmVjb2duaXplIHRoYXQgc29tZSBwcm9ibGVtcyBzaGFyZSB0aGUgc2FtZSBjaGFyYWN0ZXJpc3RpY3MgYW5kIHVzZSB0aGUgc2FtZSBhbGdvcml0aG0gdG8gc29sdmUgYm90aCAoZ2VuZXJhbGlzYXRpb24pLiIsInVuZGVyc3RhbmRpbmciOjEsImluZGVwZW5kZW5jZSI6MSwiZGlmZmljdWx0eSI6IjYifSx7Im5hbWUiOiJJIHVuZGVyc3RhbmQgdGhlIGlkZWEgb2YgcGVyZm9ybWFuY2UgZm9yIGFsZ29yaXRobXMgYW5kIEkgYXBwcmVjaWF0ZSB0aGF0IHNvbWUgYWxnb3JpdGhtcyBhcmUgYmV0dGVyIG9yIHdvcnNlIHdoZW4gcGVyZm9ybWluZyB0aGUgc2FtZSB0YXNrIGUuZy4gdGhlIGVmZmljaWVuY3kgb2YgZGlmZmVyZW50IHNvcnRpbmcgbWV0aG9kcy4iLCJ1bmRlcnN0YW5kaW5nIjoxLCJpbmRlcGVuZGVuY2UiOjEsImRpZmZpY3VsdHkiOiI2In0seyJuYW1lIjoiSSByZWNvZ25pemUgdGhhdCB0aGUgZGVzaWduIG9mIGFuIGFsZ29yaXRobSBpcyBkaWZmZXJlbnQgZnJvbSB0aGUgd2F5IHRoYXQgaXQgaXMgZXhwcmVzc2VkIGFzIGEgcHJvZ3JhbSB1c2luZyBhIHByb2dyYW1taW5nIGxhbmd1YWdlLiIsInVuZGVyc3RhbmRpbmciOjEsImluZGVwZW5kZW5jZSI6MSwiZGlmZmljdWx0eSI6IjYifSx7Im5hbWUiOiJJIGhhdmUgZXZhbHVhdGVkIHRoZSBlZmZlY3RpdmVuZXNzIG9mIGFsZ29yaXRobXMgYW5kIG1vZGVscyBmb3Igc2ltaWxhciBwcm9ibGVtcy4iLCJ1bmRlcnN0YW5kaW5nIjoxLCJpbmRlcGVuZGVuY2UiOjEsImRpZmZpY3VsdHkiOiI3In0seyJuYW1lIjoiSSByZWNvZ25pemUgd2hlcmUgaW5mb3JtYXRpb24gY2FuIGJlIGZpbHRlcmVkIG91dCBpbiBnZW5lcmFsaXppbmcgcHJvYmxlbSBzb2x1dGlvbnMgKGFic3RyYWN0aW9uKS4iLCJ1bmRlcnN0YW5kaW5nIjoxLCJpbmRlcGVuZGVuY2UiOjEsImRpZmZpY3VsdHkiOiI3In0seyJuYW1lIjoiSSBoYXZlIHVzZWQgbG9naWNhbCByZWFzb25pbmcgdG8gZXhwbGFpbiBob3cgYW4gYWxnb3JpdGhtIHdvcmtzLiIsInVuZGVyc3RhbmRpbmciOjEsImluZGVwZW5kZW5jZSI6MSwiZGlmZmljdWx0eSI6IjcifSx7Im5hbWUiOiJJIGhhdmUgcmVwcmVzZW50ZWQgYWxnb3JpdGhtcyB1c2luZyBzdHJ1Y3R1cmVkIGxhbmd1YWdlLiIsInVuZGVyc3RhbmRpbmciOjEsImluZGVwZW5kZW5jZSI6MSwiZGlmZmljdWx0eSI6IjcifSx7Im5hbWUiOiJJIGhhdmUgZGVzaWduZWQgYSBzb2x1dGlvbiB0byBhIHByb2JsZW0gdGhhdCBkZXBlbmRzIG9uIHNtYWxsZXIgaW5zdGFuY2VzIG9mIGhlIHNhbWUgcHJvYmxlbSAocmVjdXJzaW9uKS4iLCJ1bmRlcnN0YW5kaW5nIjoxLCJpbmRlcGVuZGVuY2UiOjEsImRpZmZpY3VsdHkiOiI4In0seyJuYW1lIjoiSSB1bmRlcnN0YW5kIHRoYXQgc29tZSBwcm9ibGVtcyBjYW5ub3QgYmUgc29sdmVkIGNvbXB1dGF0aW9uYWxseSAodGhlcmUgYXJlIHNvbWUgcHJvYmxlbXMgdGhhdCBjb21wdXRlcnMgY2Fubm90IGRvKS4iLCJ1bmRlcnN0YW5kaW5nIjoxLCJpbmRlcGVuZGVuY2UiOjEsImRpZmZpY3VsdHkiOiI4In1dfSx7Im5hbWUiOiJEZXZlbG9waW5nIENvbXB1dGVyIFByb2dyYW1zIiwiY3JpdGVyaWEiOltdfV0"));
		a.updateTopics();
		
		
		$('#btn_save').click(function(e) {
			console.log(btoa(JSON.stringify(a.topics)));
		});
	};
};