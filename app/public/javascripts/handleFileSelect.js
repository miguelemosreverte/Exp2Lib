
var files_contents = new Object;
var progress_bars_by_tag = {};

function errorHandler(evt) {
    switch(evt.target.error.code) {
      case evt.target.error.NOT_FOUND_ERR:
        alert('File Not Found!');
        break;
      case evt.target.error.NOT_READABLE_ERR:
        alert('File is not readable');
        break;
      case evt.target.error.ABORT_ERR:
        break; // noop
      default:
        alert('An error occurred reading this file.');
    };
}

function updateProgress(evt,progress) {
    // evt is an ProgressEvent.
    if (evt.lengthComputable) {
      var percentLoaded = Math.round((evt.loaded / evt.total) * 100);
      // Increase the progress bar length.
      if (percentLoaded < 100) {
        progress.style.width = percentLoaded + '%';
        progress.textContent = percentLoaded + '%';
      }
    }
}


function handleFileSelect(evt) {

    //tag examples: "LM" indicates that the file should be saved as the Language Model
    var tag = this.name;

    var progress = progress_bars_by_tag[tag];
    // Reset progress indicator on new file selection.
    progress.style.width = '10%';
    progress.textContent = '0%';

    var reader = new FileReader();
    reader.onerror = errorHandler;
    reader.onprogress = updateProgress(progress);
    reader.onabort = function(e) {
      alert('File read cancelled');
    };
    reader.onloadstart = function(e) {
      $('#progress_bar').className = 'loading';
    };
    reader.onload = function(e) {
      // Ensure that the progress bar displays 100% at the end.
      progress.style.width = '100%';
      progress.textContent = '100%';
      setTimeout("$('#progress_bar').className='';", 2000);
      maybeSetText(tag,e.target.result);
      files_contents[tag] = e.target.result;
      if (tag in function_by_filename)
      {
        function_by_filename[tag](e.target.result);
      }
    }

    // Read in the image file as a binary string.
    reader.readAsBinaryString(evt.target.files[0]);
}


$(document).ready(function(){
    $("#TrainingButton").click(function(e){
        e.preventDefault();
        $.ajax({
            type: "POST",
            url: "Train",
            success: function(result) {
                $("#TrainingResults").text(result);
            },
            error: function(result) {
                alert('error');
            }
        });
    });
    var elements = $('.files');
    var progress_bars = $('.percent');

    for (let element of elements) {
      progress_bar = progress_bars[Object.keys(progress_bars_by_tag).length];
      progress_bars_by_tag[element.name] = progress_bar;
      element.addEventListener('change', handleFileSelect, false);
    }

});
