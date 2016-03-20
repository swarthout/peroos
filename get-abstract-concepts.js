function getAbstractConcepts() {
  var text = $('#body-of-text').text();
  text = text.length > 0 ? text : ' ';
  if(text != previousText){
    $.post('/api/extractConceptMentions', {
        text: text
      })
      .done(function(results) {

        $('.concept--abstract-concept-list').empty();

        var unique_concept_array = [];

        if (results.annotations.length)
          $('.concept--abstract-concept-title').addClass('active');

        for (var i = 0; i < results.annotations.length; i++) {
          if (check_duplicate_concept(unique_concept_array, results.annotations[i].concept.id) || unique_concept_array.length == 3)
            continue;
          else
            unique_concept_array.push(results.annotations[i].concept.id);

          var abstract_concept_div = '<div class="concept--abstract-concept-list-container"><span class="concept--abstract-concept-list-item" concept_id="' + results.annotations[i].concept.id + '">' + results.annotations[i].concept.label + '</span></div>';
          $('.concept--abstract-concept-list').append(abstract_concept_div);
        }

        $('#text-panel-API-data').empty();
        $('#text-panel-API-data').html(JSON.stringify(results, null, 2));
        $('#text-annotator-view-code-btn').removeAttr('disabled');
        $('#text-annotator-view-code-btn').prev().removeClass('icon-code-disabled');

        var concept_array = [];
        var input_concept_labels = [];
        for (var i = 0; i < ($('.concept--abstract-concept-list-item').length < 3 ? $('.concept--abstract-concept-list-item').length : 3); i++) {
          concept_array.push($('.concept--abstract-concept-list-item:eq(' + i + ')').attr('concept_id'));
          input_concept_labels.push($('.concept--abstract-concept-list-item:eq(' + i + ')').text());
        }

        $('#TED-panel-API-data').empty();
        $('#TED-panel-list').empty();
        if (concept_array.length > 0) {
          $('._demo--output').css('display', 'none');
          $('._content--loading').show();

          $.get('/api/conceptualSearch', {
              ids: concept_array,
              limit: 3,
              document_fields: JSON.stringify({
                user_fields: 1
              })
            })
            .done(function(results) {

              $('#TED-panel-API-data').empty();
              $('#TED-panel-API-data').html(JSON.stringify(results, null, 2));

              $('#TED-panel-list').empty();
              for (var i = 0; i < results.results.length; i++)
                generate_TED_panel(results.results[i], input_concept_labels);
            }).fail(function(error) {
              error = error.responseJSON ? error.responseJSON.error : error.statusText;
              console.log('error:', error);
            }).always(function() {
              $('._content--loading').css('display', 'none');
              $('._demo--output').show();

              var top = document.getElementById('try-this-service').offsetTop;
              window.scrollTo(0, top);
            });
        }

      }).fail(function(error) {
        error = error.responseJSON ? error.responseJSON.error : error.statusText;
        console.log('extractConceptMentions error:', error);
      }).always(function() {

      });
      previousText = text;
    }
}

function check_duplicate_concept(unique_concept_array, concept) {
  for (var i = 0; i < unique_concept_array.length; i++) {
    if (unique_concept_array[i] == concept)
      return true;
  }

  return false;
}