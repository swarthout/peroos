const rest = feathers.rest('http://pacific-forest-32636.herokuapp.com/');
const app = feathers()
  .configure(feathers.hooks())
  .configure(rest.superagent(superagent));

const summaryService = app.service('/summaries/');
const videosService = app.service('relevant_videos/')

function getSummary(){
  var url = document.getElementById('query_url').value;

  if(url){
    document.getElementById('result-card').style.display = 'none';
    document.getElementById('loader').style.display = 'block';
    summaryService.find(
      { query: {
        url: url
      }})
      .then(text => {
        document.getElementById('loader').style.display = 'none';
        document.getElementById('result').innerHTML = text;
        document.getElementById('result-card').style.display = 'block';
        videosService.find(
          {
            query: {
              text: text
            }
          }
        ).then(videos  =>
          {
            for (var i = 0; i < videos.length; i++) {
              var video = videos[i];
              // console.log(video);
              var img_node = document.getElementById('video_' + i);
              img_node.src = video.thumbnail;

              var descr_node = document.getElementById('descr_' + i);
              descr_node.innerHTML = video.description;

              var title_node = document.getElementById('title_' + i);
              title_node.innerHTML = video.title;

              var link_node = document.getElementById('link_' + i);
              link_node.href = video.url;

              document.getElementById('talk_' + i).style.display = 'block';
            }
          }
        )
    }).catch(error => {
      console.error(error);
    });
  }
  return false;
}
