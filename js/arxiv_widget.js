// JavaScript widget to display list of articles associated with an
// arXiv author id. See http://arxiv.org/help/myarticles
//
// Based on code copyright (C) 2009-2011 arXiv.org
// and released under GNU GPL. 

// Customized by Willie WY Wong
// Modified by Andrew Fowlie

var article_html = {};
var authorid_list = ["fowlie_a_1"]
var months = [ "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
process_authorid_list(authorid_list);

function process_authorid_list(authorid_list)
{
  for (let i = 0; i < authorid_list.length; i++)
  {
    json_to_html_authorid(authorid_list[i]);
  }
}

function set_html(article_html)
{
  console.log('adding articles');
  var html = '<div id="arxivcontainer">\n';

  var thisYear = 0;
  var thisMonth = 0;
  
  var maxArticles = document.getElementById('arxivfeed').getAttribute("maxArticles");
  var n = 0;

  for (let h in article_html)
  {

    n += 1;
    if (maxArticles > 0 && n > maxArticles)
    {
      break;
    }

    var d = new Date(h);
    var year = d.getFullYear();
    var month = d.getMonth();
    if (year != thisYear || month != thisMonth)
    {
      thisYear = year;
      thisMonth = month;
      html += '<div class="card experience course" style="width:90%">\n<div class="card-body" style="width:100%">';
      html += '<h4 class="card-title exp-title my-0">' + thisYear + '</h4>\n';
      html += months[thisMonth];
      html += '</div></div>\n';
    }   
    
    html += article_html[h];
  }

  html += '</div>\n'
  document.getElementById('arxivfeed').innerHTML = html;
}

function sort_key_date(obj) {
  var dates = Object.keys(obj);
  sorted_dates = dates.sort((a, b) => Date(b) - Date(a));
  sorted = {}
  for (let i = 0; i < sorted_dates.length; i++)
  {
    var d = sorted_dates[i];
    sorted[d] = obj[d];
  }
  return sorted;
}

function json_to_html_authorid(arxiv_authorid)
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
    var showAbstract = document.getElementById('arxivfeed').getAttribute("showAbstract");
    if (showAbstract != 0)
    {
      html += '<div class="card-text">' + snippet.summary + '</div>\n';
    }
    
    html += '</div>\n </div>\n';
    article_html[snippet.published] = html;
  }
  article_html = sort_key_date(article_html);
  set_html(article_html);
}
