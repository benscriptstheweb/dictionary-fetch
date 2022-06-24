<script lang=ts>
</script>

<svelte:head>
    <script src="https://vjs.zencdn.net/7.19.2/video.min.js"></script>
    <link href="https://vjs.zencdn.net/7.19.2/video-js.css" rel="stylesheet" />
</svelte:head>
<div>   
    <video id="vid1" class="vjs-matrix video-js" controls preload="auto" poster="MY_VIDEO_POSTER.jpg">
        <track kind="captions">
        <source src="//vjs.zencdn.net/v/oceans.mp4" type="video/mp4" />
        <source src="/vjs.zencdn.net/v/oceans.webm" type="video/webm" />
        
        <p class="vjs-no-js">
        To view this video please enable JavaScript, and consider upgrading to a
        web browser that
        <a href="https://videojs.com/html5-video-support/" target="_blank">supports HTML5 video</a>
        </p>
    </video>
    <br>
    <audio id="audio_example" class="video-js vjs-default-skin" controls preload="auto" width="600" height="600" poster="/img/awesome-album-art.png">
        <source src="/chimes.mp3" type='audio/mp3' />
    </audio>
</div>

<style>
    #vid1 {
        width: 630px;
        height: 264px;
    }
    #audio_example {
        width: 500px;
        height: 500px;
    }
</style>