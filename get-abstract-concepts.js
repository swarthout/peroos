function getAbstractConcepts(text) {
  text = text.length > 0 ? text : ' ';
  if(text != previousText){
    $.post('/api/extractConceptMentions', {
        text: text
      })
      .done(function(results) {

        var unique_concept_array = [];

        for (var i = 0; i < results.annotations.length; i++) {
          if (check_duplicate_concept(unique_concept_array, results.annotations[i].concept.id) || unique_concept_array.length == 3)
            continue;
          else
            unique_concept_array.push(results.annotations[i].concept.id);
        }

        if (unique_concept_array.length > 0) {

          $.get('/api/conceptualSearch', {
              ids: concept_array,
              limit: 3,
              document_fields: JSON.stringify({
                user_fields: 1
              })
            })
            .done(function(results) {

              for (var i = 0; i < results.results.length; i++)

            }).fail(function(error) {
              error = error.responseJSON ? error.responseJSON.error : error.statusText;
              console.log('error:', error);
            }).always(function() {
            });
        }

      }).fail(function(error) {
        error = error.responseJSON ? error.responseJSON.error : error.statusText;
        console.log('extractConceptMentions error:', error);
      }).always(function() {

      });
    }
}

function check_duplicate_concept(unique_concept_array, concept) {
  for (var i = 0; i < unique_concept_array.length; i++) {
    if (unique_concept_array[i] == concept)
      return true;
  }

  return false;
}
