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

    const DurationDisplay = videojs.getComponent('DurationDisplay');
    const RemainingTimeDisplay = videojs.getComponent('RemainingTimeDisplay');
    const ProgressControl = videojs.getComponent('ProgressControl');
    const PlayToggle = videojs.getComponent('PlayToggle');
    const VolumePanel = videojs.getComponent('VolumePanel');
    const FullscreenToggle = videojs.getComponent('FullscreenToggle');
    const SubtitlesButton = videojs.getComponent('SubtitlesButton');

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
                subsCapsButton: false,
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
        settingsGroup.addChild(new VolumePanel(mediaPlayer, { inline: false }));
        settingsGroup.addChild(new SubtitlesButton(mediaPlayer));
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
    } else {
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
    <video-js id={mediaID} class="video-js vjs-big-play-centered" poster="/screen.png">
        <track src="https://d34ji3l0qn3w2t.cloudfront.net/9bdbc547-6303-40a2-a283-ff11fbaf7197/1/mwbv_E_202205_07.vtt" kind="subtitles" srclang="en" label="English"/>
        <source src="https://d34ji3l0qn3w2t.cloudfront.net/e698b557-0f22-4979-91b3-41a62c563712/1/mwbv_E_202205_07_r720P.mp4" type="video/mp4" />
        <source src="https://d34ji3l0qn3w2t.cloudfront.net/93179444-c2a7-4316-b33e-dfdc0ed56e29/1/mwbv_E_202205_07_r480P.mp4" type="video/mp4" />
    </video-js>
{:else if mediaType === 'audio'}
    <video-js id={mediaID} class="video-js vjs-big-play-centered audio-video-js" poster="/aud.png">
        <source src="/chimes.mp3" type="audio/mp3" />
    </video-js>
{/if}