<script>
    import { getContext } from "svelte";

    import prepareXP from "../../dataPreparationHelpers/prepareXP";

    import ImportButton from "../ImportButton.svelte";

    import getDocumentSourceTooltip from "../../../utils/getDocumentSourceTooltip";

    export let document;

    function getCreatureTypes(monster) {
        return (monster?.system?.details?.creatureTypes ?? [])
            .map((creatureType) => {
                return creatureTypes[creatureType] ?? creatureType ?? "";
            })
            .sort((a, b) => a.localeCompare(b))
            .join(", ");
    }

    function getCRLabel(monster) {
        let cr = monster?.system?.details?.cr;

        if (cr === undefined) return "?";
        if (cr === 0.125 || cr === "0.125") return "⅛";
        if (cr === 0.25 || cr === "0.25") return "¼";
        if (cr === 0.5 || cr === "0.5") return "½";

        return cr;
    }

    function getMonsterDetailsLabel(monster) {
        const components = [];

        const cr = getCRLabel(monster);
        const creatureTypes = getCreatureTypes(monster);
        const isElite = monster?.system?.details?.elite;
        const sizeCategory = actorSizes[monster?.system?.traits?.size] ?? "";
        const xp = prepareXP(monster);

        if (cr === "?") {
            components.push(sizeCategory, creatureTypes);
        } else {
            components.push(
                sizeCategory,
                creatureTypes,
                "|",
                isElite ? "Elite" : "",
                `CR ${cr}`,
                `(${xp} XP)`,
            );
        }

        return components
            .filter(
                (component) =>
                    !foundry.utils.isEmpty(component) && component !== "",
            )
            .join(" ");
    }

    function getMonsterSource(monster) {
        if (typeof monster.system.source !== "string") return null;

        const source = CONFIG.A5E.products[monster.system.source];

        return source || null;
    }

    function onDragStart(event) {
        const data = {
            type: collection.documentName,
            uuid: collection.getUuid(document._id),
        };
        return event.dataTransfer.setData("text/plain", JSON.stringify(data));
    }

    const collection = getContext("collection");
    const { actorSizes, creatureTypes } = CONFIG.A5E;

    $: monsterDetails = getMonsterDetailsLabel(document);
    $: monsterSource = getMonsterSource(document);
</script>

<!-- svelte-ignore a11y-click-events-have-key-events a11y-no-noninteractive-element-interactions -->
<li
    class="a5e-item a5e-item--compendium-document"
    draggable="true"
    on:click={async () => {
        const doc =
            collection.get(document._id) ??
            (await collection.getDocument(document._id));
        doc.sheet?.render(true);
    }}
    on:dragstart={onDragStart}
>
    <img
        class="a5e-item__image a5e-item__image--compendium-document"
        src={document?.img}
        alt={document?.name}
    />

    <h3 class="a5e-item__name a5e-item__name--compendium-document">
        {document?.name}

        {#if document?.system?.details?.elite}
            <i
                class="a5e-item__icon fa-solid fa-skull"
                data-tooltip="Elite Monster"
                data-tooltip-direction="UP"
            />
        {/if}

        {#if document?.system?.details?.isSquad}
            <i
                class="a5e-item__icon fa-solid fa-people-group"
                data-tooltip="Squad"
                data-tooltip-direction="UP"
            />
        {/if}

        {#if document?.system?.details?.isSwarm}
            <i
                class="a5e-item__icon fa-solid fa-locust"
                data-tooltip="Swarm"
                data-tooltip-direction="UP"
            />
        {/if}
    </h3>

    <div class="a5e-item__details">
        {#if monsterSource?.abbreviation}
            <a
                class="a5e-item__source-tag"
                href={monsterSource?.url}
                target="_blank"
                data-tooltip={getDocumentSourceTooltip(monsterSource)}
                data-tooltip-class="a5e-tooltip a5e-tooltip--dark a5e-tooltip--document-source"
                on:click|stopPropagation
            >
                {monsterSource?.abbreviation}
            </a>
        {/if}

        {monsterDetails}
    </div>

    <ImportButton {document} />
</li>
