<script>
    import MediaPlayer from "../MediaPlayer.svelte";

    export let darkMode;
</script>

<MediaPlayer darkMode={darkMode} mediaID="A" mediaType='video'/>
<MediaPlayer darkMode={darkMode} mediaID="B" mediaType='audio'/>

<style></style>