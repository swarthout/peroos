const rest = feathers.rest('http://localhost:3000');
const app = feathers()
  .configure(feathers.hooks())
  .configure(rest.superagent(superagent));

const summaryService = app.service('/summaries/');

function getSummary(){
  var url = document.getElementById('query_url').value;
  
  if(url){
    summaryService.find(
      { query: {
        url: url
      }})
      .then(result => {
      document.getElementById('result').innerHTML = result;
    }).catch(error => {
      console.error(error);
    });
  }
  return false;
}
