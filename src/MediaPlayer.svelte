<script lang=ts>
    import { onDestroy, onMount } from "svelte";

    import videojs from "video.js";
    import ProgressGroup from "./progressGroup";
    import PlayGroup from "./playGroup";
    import SettingsGroup from "./settingsGroup";

    export let darkMode: boolean;
    export let mediaID: string;
    export let mediaType: string;
    
    let mediaPlayer: any;
    let currentMediaPlayer = document.getElementById(mediaID) as HTMLElement;

    let DurationDisplay = videojs.getComponent('DurationDisplay');
    let RemainingTimeDisplay = videojs.getComponent('RemainingTimeDisplay');
    let ProgressControl = videojs.getComponent('ProgressControl');
    let PlayToggle = videojs.getComponent('PlayToggle');
    let VolumePanel = videojs.getComponent('VolumePanel');
    let FullscreenToggle = videojs.getComponent('FullscreenToggle');

    onMount(async () => {

        mediaPlayer = await videojs(mediaID, {
            controls: true,
            preload: 'auto',
            fluid: true,   
            controlBar: {
                durationDisplay: false,
                progressControl: false,
                remainingTimeDisplay: false,
                playToggle: false,
                volumePanel: false,
                subsCapsButton: true,
                pictureInPictureToggle: false,
                fullscreenToggle: false,
            },
        });

        let playGroup = new PlayGroup(mediaPlayer);
        playGroup.addChild(new PlayToggle(mediaPlayer));

        mediaPlayer.getChild('ControlBar').addChild(playGroup);

        let progressGroup = new ProgressGroup(mediaPlayer);
        progressGroup.addChild(new RemainingTimeDisplay(mediaPlayer));
        progressGroup.addChild(new ProgressControl(mediaPlayer));
        progressGroup.addChild(new DurationDisplay(mediaPlayer));

        mediaPlayer.getChild('ControlBar').addChild(progressGroup);

        let settingsGroup = new SettingsGroup(mediaPlayer);
        settingsGroup.addChild(new VolumePanel(mediaPlayer, { inline: false }))
        settingsGroup.addChild(new FullscreenToggle(mediaPlayer));
        
        mediaPlayer.getChild('ControlBar').addChild(settingsGroup);
    });


    onDestroy(() => {
        videojs(currentMediaPlayer).dispose();
    });

    $: if (darkMode) {
        const controlBars = document.body.querySelectorAll('.vjs-control-bar') as NodeListOf<HTMLElement>;
        
        for (let controlbar of controlBars) {
            controlbar.style.backgroundColor = "rgba(39, 39, 39, 0.6)";
        }
    }

    $: if (!darkMode) {
        const controlBars = document.body.querySelectorAll('.vjs-control-bar') as NodeListOf<HTMLElement>;
        
        for (let controlbar of controlBars) {
            controlbar.style.backgroundColor = "rgba(190, 190, 190, 0.6)";
        }
    }
</script>

<svelte:head>
	<link href="https://vjs.zencdn.net/7.19.2/video-js.css" rel="stylesheet">
	<link rel='stylesheet' href='/playerskin.css'>
	<script src="https://vjs.zencdn.net/7.19.2/video.min.js"></script>
</svelte:head>

{#if mediaType === 'video'}
<div>
    <video-js id={mediaID} class="video-js vjs-big-play-centered" poster="/screen.png">
        <source src="https://download-a.akamaihd.net/files/content_assets/ff/502018114_E_cnt_1_r720P.mp4" type="video/mp4" />
    </video-js>
    <br>
</div>
{:else if mediaType === 'audio'}
    <div>   
        <video-js id={mediaID} class="video-js audio-video-js">
            <source src="/chimes.mp3" type="audio/mp3" />
        </video-js>
        <br>
    </div>
{/if}