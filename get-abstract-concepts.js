function getAbstractConcepts(text) {
  text = text.length > 0 ? text : ' ';
    extractConceptMentions({
        text: text
      })
      .then(function(results) {

        var unique_concept_array = [];

        for (var i = 0; i < results.annotations.length; i++) {
          if (check_duplicate_concept(unique_concept_array, results.annotations[i].concept.id) || unique_concept_array.length == 3)
            continue;
          else
            unique_concept_array.push(results.annotations[i].concept.id);
        }

        if (unique_concept_array.length > 0) {

          conceptualSearch( {
              ids: concept_array,
              limit: 3,
              document_fields: JSON.stringify({
                user_fields: 1
              })
            })
            .then(function(results) {

              return results;

            })
        }

      })
}

function check_duplicate_concept(unique_concept_array, concept) {
  for (var i = 0; i < unique_concept_array.length; i++) {
    if (unique_concept_array[i] == concept)
      return true;
  }
  return false;
}
