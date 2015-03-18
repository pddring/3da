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
		html += '<label for="txt_topic_critera">Assessment criteria:</label><textarea id="txt_topic_criteria">';
		if(topic.criteria.length > 0){
			for(var i = 0; i < topic.criteria.length; i++) {
				html += topic.criteria[i].difficulty + " " + topic.criteria[i].name + "\n";
			}
		} else {
			html += 'Copy and paste the relevant "I can" statements in here';
		}
		html +='</textarea>';
		html += '<div><a data-icon="check" class="dlg_button" id="btn_dlg_ok">OK</a><a data-icon="delete" class="dlg_button" id="btn_dlg_cancel">Cancel</a></div>';
		
		$('#dlg').html(html).popup("open");
		$('#txt_topic_criteria').textinput();
		$("#dlg").popup("reposition", {positionTo: 'origin'});
		
		$('.dlg_button').button().click(function(e) {
			switch(e.currentTarget.id) {
				case 'btn_dlg_ok':
					var lines = $('#txt_topic_criteria').val().split("\n");
					topic.criteria = [];
					for(var i = 0; i < lines.length; i++) {
						var line = lines[i].trim();
						var difficulty = line.match(/^(\d+)\s*(.*)$/);
						var c = new Criteria(line);
						if(difficulty) {
							c.difficulty = difficulty[1];
							c.name = difficulty[2];
						} 
						topic.criteria.push(c);
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
		html += '<div data-role="fieldcontain" class="grade_area"><label for="slider_understanding"><h3>Depth of understanding:</h3></label><input class="slider_criteria" type="range" id="slider_understanding" value="' + criteria.understanding + '" min="1" max="5" /><div id="understanding_holder"></div></div>';
		html += '<div data-role="fieldcontain" class="grade_area"><label for="slider_independence"><h3>Independence:</h3></label><input class="slider_criteria" type="range" id="slider_independence" value="' + criteria.independence + '" min="1" max="5" /><div id="independence_holder"></div></div>';
		html += '<div><a data-icon="check" class="dlg_button" id="btn_dlg_ok">OK</a><a data-icon="delete" class="dlg_button" id="btn_dlg_cancel">Cancel</a></div></div>';

		$('#dlg').html(html).popup("open");
		$('#dlg').trigger('create');
		$("#dlg").popup("reposition", {positionTo: 'origin'});
		
		var updateDefinitions = function(e) {
			var understanding = $('#slider_understanding').val();
			var independence = $('#slider_independence').val();
			$('#understanding_holder').html(a.descriptions.understanding[understanding]);
			$('#independence_holder').html(a.descriptions.independence[independence]);
		}
		
		updateDefinitions();
		$('.slider_criteria').on({'slidestop': updateDefinitions, 'slidestart':updateDefinitions});
		
		$('.dlg_button').button().click(function(e) {
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
		html += '<div><a data-icon="check" class="dlg_button" id="btn_dlg_ok">OK</a><a data-icon="delete" class="dlg_button" id="btn_dlg_cancel">Cancel</a></div></div>';

		$('#dlg').html(html).popup("open");
		
		// ui
		$('#txt_topic_name').textinput();
		$("#dlg").popup("reposition", {positionTo: 'origin'});
		
		
		$('.dlg_button').button().click(function(e) {
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
			html += '<a id="btn_edit_topic_' + i + '" class="btn_edit_topic" data-icon="gear">Edit topic ' + a.topics[i].name + '</a>';
			for(var j = 0; j < a.topics[i].criteria.length; j++) {
				html += '<div class="criteria" id="criteria_' + i + '_' + j + '"><h3>' + a.descriptions.difficulty[a.topics[i].criteria[j].difficulty] + '</h3>' + a.topics[i].criteria[j].name + '<div><div class="criteria_indicator"><div class="indicator_understanding">Understanding: ' + a.topics[i].criteria[j].understanding + '</div><div class="indicator_independence">Independence: ' + a.topics[i].criteria[j].independence + '</div></div><a data-icon="edit" class="btn_grade" id="btn_grade_' + i + '_' + j + '" data-inline="true">Grade</a></div></div>';
			}
			html += '</div>';
		}
		html += '<a id="btn_add_topic" class="btn" data-icon="plus">Add Topic</a>';
		$("#subject").html(html);
		
		// buttons
		
		$('.btn_grade').button().click(function(e){
			var data = e.currentTarget.id.split("_");
			var topicId = parseInt(data[2], 10);
			var criteriaId = parseInt(data[3], 10);
			var criteria = a.topics[topicId].criteria[criteriaId];
			
			a.showGradeCriteria(criteria);
		});
		
		$('.btn_edit_topic').button().click(function(e) {
			var topic = a.topics[parseInt(e.currentTarget.id.split("_")[3], 10)];
			
			a.showEditTopic(topic);
		});
		
		$('.btn').button().click(function(e) {
			switch(e.currentTarget.id) {
				case 'btn_add_topic':
					a.showAddTopic();
				break;
			}
		});
	};
	
	this.init = function() {
		a.updateTopics();
		
		
	};
};