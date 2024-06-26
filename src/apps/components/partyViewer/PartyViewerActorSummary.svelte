<script>
    import { createEventDispatcher, onDestroy } from "svelte";

    import PartyViewerAttributesSummary from "./PartyViewerAttributesSummary.svelte";
    import PartyViewerCoreSummary from "./PartyViewerCoreSummary.svelte";
    import PartyViewerLanguagesSummary from "./PartyViewerLanguagesSummary.svelte";
    import PartyViewerResourceSummary from "./PartyViewerResourceSummary.svelte";
    import PartyViewerWealthSummary from "./PartyViewerWealthSummary.svelte";

    export let actor;
    export let currentViewMode = "core";
    export let highestPassiveScores = {};
    export let highestSpellSlotLevel = 0;
    export let partyHasExertionPool = true;
    export let partyHasInspiration = false;
    export let partyHasSpellPointPool = true;
    export let partyIsLocked = false;
    export let showActorImagesInPartyViewer = true;

    function getViewModeComponent(viewMode) {
        switch (viewMode) {
            case "attributes":
                return PartyViewerAttributesSummary;
            case "core":
                return PartyViewerCoreSummary;
            case "languages":
                return PartyViewerLanguagesSummary;
            case "resources":
                return PartyViewerResourceSummary;
            case "wealth":
                return PartyViewerWealthSummary;
            default:
                return PartyViewerCoreSummary;
        }
    }

    const actorId = $actor.uuid;
    const dispatch = createEventDispatcher();
    const { isGM } = game.user;

    const unsubscribe = actor.subscribe((_) =>
        dispatch("actor-updated", actorId),
    );

    $: viewComponent = getViewModeComponent(currentViewMode);

    onDestroy(() => {
        unsubscribe();
    });
</script>

<li
    class="a5e-item a5e-item--party-member"
    on:dblclick={() => $actor?.sheet.render(true)}
>
    {#if $showActorImagesInPartyViewer}
        <img class="actor-image" src={$actor?.img} alt={$actor?.name} />
    {/if}

    <span class="actor-name">{$actor?.name}</span>

    <svelte:component
        this={viewComponent}
        {actor}
        propData={{
            highestPassiveScores,
            highestSpellSlotLevel,
            partyHasExertionPool,
            partyHasInspiration,
            partyHasSpellPointPool,
        }}
    />

    {#if isGM && !partyIsLocked}
        <span class="delete-wrapper">
            <button
                class="a5e-button a5e-button--delete delete-button fas fa-trash"
                data-tooltip="Remove Actor from the Party"
                data-tooltip-direction="UP"
                on:click={() => dispatch("remove-actor", $actor.uuid)}
            />
        </span>
    {/if}
</li>

<style lang="scss">
    .actor-image {
        height: 1.75rem;
        width: 1.75rem;
        margin: 0;
        padding: 0;
        object-fit: cover;
        object-position: 50% 0;
        grid-area: img;
    }

    .actor-name {
        grid-area: name;
        padding-left: 0.25rem;
        text-overflow: ellipsis;
    }

    .delete-button {
        padding: 0.25rem;
        grid-area: delete;
    }

    .delete-wrapper {
        text-align: center;
    }
</style>
