<script>
    import { getContext, onDestroy, setContext } from "svelte";
    import { TJSDocument } from "#runtime/svelte/store/fvtt/document";
    import { localize } from "#runtime/svelte/helper";

    import prepareTraitGrantConfigObject from "../../../utils/prepareTraitGrantConfigObject";
    import updateDocumentDataFromField from "../../../utils/updateDocumentDataFromField";

    import FieldWrapper from "../FieldWrapper.svelte";
    import Section from "../Section.svelte";
    import CheckboxGroup from "../CheckboxGroup.svelte";
    import ComplexDetailEmbed from "../ComplexDetailEmbed.svelte";
    import GrantConfig from "./GrantConfig.svelte";

    export let { document, grantId, grantType } =
        getContext("#external").application;

    function updateImage() {
        const current = grant?.img;

        const filePicker = new FilePicker({
            type: "image",
            current,
            callback: (path) => {
                onUpdateValue("img", path);
            },
        });

        return filePicker.browse();
    }

    function onUpdateValue(key, value) {
        if (key === "traits.traitType") {
            updateDocumentDataFromField(
                $item,
                `system.grants.${grantId}.traits`,
                { base: [], options: [], total: 0 },
            );
        }

        key = `system.grants.${grantId}.${key}`;
        updateDocumentDataFromField($item, key, value);
    }

    onDestroy(() => {
        item.destroy();
    });

    const item = new TJSDocument(document);
    const configObject = prepareTraitGrantConfigObject();

    $: grant = $item.system.grants[grantId];
    $: traitType = grant?.traits?.traitType || "armorTypes";

    setContext("item", item);
    setContext("grantId", grantId);
    setContext("grantType", grantType);
</script>

<form>
    <header class="sheet-header">
        <!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <img
            class="grant-image"
            src={grant.img || $item.img || "icons/svg/upgrade.svg"}
            alt={grant.label}
            on:click={updateImage}
        />

        <div class="name-wrapper">
            <input
                type="text"
                name="name"
                value={grant.label ?? ""}
                class="grant-name"
                placeholder="Bonus Name"
                on:change={({ target }) => onUpdateValue("label", target.value)}
            />
        </div>
    </header>

    <Section
        heading="Trait Type"
        --a5e-section-margin="0.25rem 0"
        --a5e-section-body-direction="row"
    >
        <FieldWrapper>
            <select
                class="u-w-fit damage-type-select"
                on:change={({ target }) =>
                    onUpdateValue("traits.traitType", target.value)}
            >
                {#each Object.entries(configObject) as [key, { label }]}
                    <option value={key} selected={traitType === key}>
                        {localize(label)}
                    </option>
                {/each}
            </select>
        </FieldWrapper>
    </Section>

    <GrantConfig>
        <CheckboxGroup
            heading="Base Options"
            options={configObject[traitType]?.config}
            selected={grant?.traits?.base}
            disabledOptions={grant?.traits?.options}
            showToggleAllButton={true}
            on:updateSelection={({ detail }) => {
                onUpdateValue("traits.base", detail);
            }}
        />

        <CheckboxGroup
            heading="Optional Choices"
            options={configObject[traitType]?.config}
            selected={grant?.traits?.options}
            disabledOptions={grant?.traits?.base}
            showToggleAllButton={true}
            on:updateSelection={({ detail }) => {
                onUpdateValue("traits.options", detail);
            }}
        />

        <FieldWrapper heading="Selectable Options Count">
            <input
                type="number"
                value={grant?.traits?.total ?? 0}
                on:change={({ target }) =>
                    onUpdateValue("traits.total", Number(target.value))}
            />
        </FieldWrapper>
    </GrantConfig>
</form>

<style lang="scss">
    form {
        display: flex;
        flex-direction: column;
        height: 100%;
        padding: var(--padding, 0.75rem);
        gap: 0.75rem;
        background: var(--background, $color-sheet-background);
        max-height: 75vh;
        overflow-y: auto;
    }

    .grant-name,
    .grant-name[type="text"] {
        font-family: $font-primary;
        font-size: $font-size-xxl;
        border: 0;
        background: transparent;
        text-overflow: ellipsis;

        &:active,
        &:focus {
            box-shadow: none;
        }
    }

    .grant-image {
        width: 2rem;
        height: 2rem;
        border-radius: 4px;
        cursor: pointer;
    }

    .name-wrapper {
        width: 100%;
    }

    .sheet-header {
        display: flex;
        align-items: center;
    }
</style>
