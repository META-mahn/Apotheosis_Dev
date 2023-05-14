<script>
    import { getContext } from "svelte";
    import { localize } from "@typhonjs-fvtt/runtime/svelte/helper";

    import DeletionConfirmationDialog from "../dialogs/initializers/DeletionConfirmationDialog";

    export let effect;

    function onEffectActivate() {}

    function onConfigure() {
        effect.sheet?.render(true);
    }

    function onDuplicate() {
        effect.duplicateEffect();
    }

    async function onDelete() {
        let dialogData;

        if (!game.settings.get("a5e", "hideDeleteConfirmation")) {
            const itemDocument = { name: effect.label, type: "Active Effect" };
            const dialog = new DeletionConfirmationDialog(itemDocument);
            await dialog.render(true);
            dialogData = await dialog.promise;

            if (!dialogData || !dialogData.confirmDeletion) return;
        }

        await game.settings.set(
            "a5e",
            "hideDeleteConfirmation",
            dialogData?.hideDeleteConfirmation ??
                game.settings.get("a5e", "hideDeleteConfirmation")
        );

        effect.delete();
    }

    const actor = getContext("actor");

    let rightClickConfigure =
        game.settings.get("a5e", "itemRightClickConfigure") ?? false;

    $: sheetIsLocked = !$actor.isOwner
        ? true
        : $actor.flags?.a5e?.sheetIsLocked ?? true;
</script>

<li
    class="effect-wrapper"
    on:auxclick|preventDefault={() => {
        if (rightClickConfigure) onConfigure();
    }}
>
    <button
        class="effect-activate-button"
        class:disable-pointer-events={!$actor.isOwner}
        disabled={true}
        on:click|stopPropagation={({ target }) => {
            target.blur();
            onEffectActivate();
        }}
    >
        <img
            class="effect-image"
            src={effect?.icon ?? actor.img ?? "icons/svg/aura.svg"}
            alt={effect?.label ?? localize("A5E.effects.new")}
        />
    </button>

    <div class="name-wrapper">
        <div class="name">
            {effect.label}
        </div>
    </div>

    <div class="indicator-wrapper">
        {#if effect.isTemporary}
            <div class="component-wrapper">
                <div
                    class="component"
                    data-tooltip="A5E.effects.type.temporary"
                    data-tooltip-direction="UP"
                >
                    <i class="fa-solid fa-hourglass-half" />
                </div>
            </div>
        {/if}

        <div class="button-wrapper">
            <button
                class="effect-button fas"
                class:fa-toggle-off={effect.isDisabled || effect.isSuppressed}
                class:fa-toggle-on={!effect.isDisabled && !effect.isSuppressed}
                data-tooltip="A5E.effects.toggleActiveState"
                data-tooltip-direction="UP"
                on:click={() => effect.toggleActiveState()}
            />
        </div>
    </div>

    <!-- Summary -->

    {#if !$actor.pack && $actor.isOwner}
        {#if !sheetIsLocked}
            <!-- svelte-ignore a11y-click-events-have-key-events -->
            <div class="track" on:click|stopPropagation>
                <i class="track-icon fa-solid fa-ellipsis-vertical" />

                <ul class="track-items">
                    <li>
                        <button
                            class="action-button fas fa-cog"
                            data-tooltip="A5E.ButtonToolTipConfigure"
                            data-tooltip-direction="UP"
                            on:click|stopPropagation={onConfigure}
                        />
                    </li>

                    <li>
                        <button
                            class="action-button fa-solid fa-clone"
                            data-tooltip="A5E.ButtonToolTipDuplicate"
                            data-tooltip-direction="UP"
                            on:click|stopPropagation={onDuplicate}
                        />
                    </li>

                    <li>
                        <button
                            class="action-button delete-button fas fa-trash"
                            data-tooltip="A5E.ButtonToolTipDelete"
                            data-tooltip-direction="UP"
                            on:click|stopPropagation={onDelete}
                        />
                    </li>
                </ul>
            </div>
        {/if}
    {/if}
</li>

<style lang="scss">
    .effect-wrapper {
        position: relative;
        display: grid;
        grid-template-areas: var(--effectTemplateAreas);
        grid-template-columns: var(--effectTemplateColumns);
        column-gap: 0.5rem;
        row-gap: 0;
        align-items: center;
        width: 100%;
        padding: 0.125rem;
        padding-right: 0.5rem;
        border: 1px solid #ccc;
        border-radius: 3px;
        background: rgba(0, 0, 0, 0.05);
        cursor: pointer;
    }

    .disable-pointer-events {
        pointer-events: none;
    }

    .effect-activate-button {
        width: 1.5rem;
        height: 1.5rem;
        padding: 0;
        margin: 0;
        background: transparent;
        border-radius: 3px;
        grid-area: icon;

        &:hover {
            box-shadow: none;

            // .effect-image {
            //     display: none;
            // }

            // .effect-image--die {
            //     display: block;
            // }
        }
    }

    .effect-image {
        display: block;
        height: 100%;
        width: auto;
    }

    .name-wrapper {
        display: flex;
        align-items: center;
        flex-grow: 0;
        gap: 0.5rem;
        overflow: hidden;
        grid-area: name;
    }

    .name {
        font-size: 0.833rem;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }

    .indicator-wrapper {
        display: flex;
        align-items: center;
        justify-content: flex-end;
        gap: 0.75rem;
        margin-inline: 0.25rem;
        grid-area: indicators;
    }

    .button-wrapper,
    .component-wrapper {
        display: flex;
        align-items: center;
        justify-content: flex-end;
        margin-inline: 0.5rem 0.375rem;
    }

    .button-wrapper {
        margin-inline: 0.25rem;
        gap: 0.5rem;
    }

    .component-wrapper {
        gap: 0.5rem;
    }

    .component {
        display: flex;
        align-items: center;
        justify-content: center;
        height: 1rem;
        width: 1rem;
        border-radius: 3px;
        font-size: 0.833rem;
        color: #808080;
    }

    .effect-button {
        flex-grow: 0;
        width: fit-content;
        padding: 0;
        margin: 0;
        background: none;
        color: #999;
        border: 0;
        font-size: 1.44rem;
        transition: all 0.15s ease-in-out;

        &:hover {
            color: #425f65;
        }

        &:hover,
        &:focus {
            box-shadow: none;
        }
    }

    .action-button {
        padding: 0.25rem;
        background: none;
        border: 0;
        transition: all 0.15s ease-in-out;
        color: #999;

        &:hover {
            color: #555;
            transform: scale(1.2);
        }

        &:hover,
        &:focus {
            box-shadow: none;
        }
    }

    .delete-button:hover {
        color: #8b2525;
    }

    .track {
        position: relative;
        z-index: 2;
        display: flex;
        align-items: center;
        width: 1.5rem;
        height: 1.5rem;
        margin-inline: 0.5rem 0.5rem;
        border-radius: 50%;
        color: #999;
        grid-area: menu;

        transition: width 0.3s ease;

        &-icon {
            z-index: 1;
            display: flex;
            width: 1.5rem;
            height: 1.5rem;
            flex-shrink: 0;
            align-items: center;
            justify-content: center;
            border: 1px solid #ccc;
            background: #ebe9e0;
            border-radius: 50%;
            cursor: pointer;
            font-size: 1rem;
            transform: translateX(-1px);

            transition: all 0.15s ease-in-out;
        }

        &-items {
            z-index: 0;
            display: none;
            align-items: center;
            gap: 0.25rem;
            height: 1.5rem;
            padding: 0 1rem 0 0.5rem;
            border: 1px solid #ccc;
            border-left: 0;
            margin: 0;
            background: #ebe9e0;
            border-radius: 0.75rem 0 0 0.75rem;
            list-style: none;
            opacity: 0;
            transform: translateX(calc(-100% - 1rem));

            transition: all 0.15s ease-in-out;
        }

        &:hover {
            overflow: initial;

            .track-items {
                display: flex;
                opacity: 1;
            }

            .track-icon {
                color: #555;
            }
        }
    }
</style>