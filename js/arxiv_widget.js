// JavaScript widget to display list of articles associated with an
// arXiv author id. See http://arxiv.org/help/myarticles
//
// Based on code copyright (C) 2009-2011 arXiv.org
// and released under GNU GPL. 

// Customized by Willie WY Wong
// Modified by Andrew Fowlie

var articleHtml = {};
var months = [ "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

processAuthorID()

function processAuthorID()
{
  for (let i = 0; i < authorID.length; i++)
  {
    json2Html(authorID[i]);
  }
}

function setHtml(articleHtml)
{
  var html = '<div id="arxivcontainer">\n';

  var thisYear = 0;
  var thisMonth = 0;
  
  var dates = dateSort(Object.keys(articleHtml));

  for (let i = 0; i < dates.length; i++)
  {

    if (maxArticles > 0 && i > maxArticles)
    {
      break;
    }

    var d = new Date(dates[i]);
    var year = d.getFullYear();
    var month = d.getMonth();

    if (year != thisYear || month != thisMonth)
    {
      thisYear = year;
      thisMonth = month;
      html += '<h5 class="mb-0">' + thisYear + '&nbsp' + months[thisMonth] + '</h5><hr style="height:0px; visibility:hidden;"/>';
    }   
    
    html += articleHtml[dates[i]];
  }

  html += '</div>\n'
  document.getElementById('arxivfeed').innerHTML = html;
}

function dateSort(obj) {
  return obj.sort((a, b) => new Date(b) - new Date(a));
}

function json2Html(arxiv_authorid)
{
  var headID = document.getElementsByTagName("head")[0];
  var newScript = document.createElement('script');
  var urlPrefix = 'https://arxiv.org/a/';
  newScript.type = 'text/javascript';
  newScript.src = urlPrefix + arxiv_authorid + '.js';
  headID.appendChild(newScript);
}

function parseAuthors(authors)
{
  var maxAuthors = 5;
  var authorSplit = authors.split(",");
  var nAuthors = authorSplit.length;
  if (nAuthors <= maxAuthors) return authors;
  return authorSplit.slice(0, maxAuthors).join() + " et al";  
}

function jsonarXivFeed(feed)
{
  for (let i = 0; i < feed.entries.length; i++)
  {     
    var snippet = feed.entries[i];
    var id = snippet.id.split('/')[4].split('v')[0];
        
    html = '<div class="card experience course" style="width:90%">\n<div class="card-body" style="width:100%">';
    html += '<h4 class="card-title exp-title my-0"><a href=' + snippet.id + '>[' + id + '] ' + snippet.title + '</a></h4>\n';
    html += '<div class="card-subtitle article-metadata my-0">' + parseAuthors(snippet.authors) + '</div>\n';

    var hasJref = (snippet.journal_ref && snippet.journal_ref.length > 1);
    var hasDoi = (snippet.doi && snippet.doi.length > 0);
    
    if (hasDoi || hasJref)
    {
      html += '<div class="card-subtitle article-metadata my-0">'
      if (hasJref)
      {
	      html += '<a href="http://dx.doi.org/' + snippet.doi +'">' + snippet.journal_ref + '</a>'; 
      }
      else
      {
        html += '<a href="http://dx.doi.org/' + snippet.doi +'">' + snippet.doi + '</a>'; 
      }
      html += '</div>\n';
    }

    // Now put in the summary
    if (showAbstract != 0)
    {
      html += '<div class="card-text">' + snippet.summary + '</div>\n';
    }
    
    html += '</div>\n </div>\n';
    articleHtml[snippet.published] = html;
  }
  setHtml(articleHtml);
}
