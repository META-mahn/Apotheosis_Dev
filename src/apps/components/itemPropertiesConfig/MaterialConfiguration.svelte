<script>
    import { getContext } from "svelte";
    import { localize } from "#runtime/svelte/helper";

    import getMaterialProperties from "../../../utils/summaries/getMaterialProperties";
    import updateDocumentDataFromField from "../../../utils/updateDocumentDataFromField";

    import CheckboxGroup from "../CheckboxGroup.svelte";
    import Section from "../Section.svelte";

    const item = getContext("item");
    const { flaws, materialProperties } = CONFIG.A5E;

    let editMode = false;

    $: selectedMaterialProperties = getMaterialProperties($item)
        .filter(Boolean)
        .join(", ");
</script>

<Section
    heading="A5E.MaterialProperties"
    headerButtons={[
        {
            classes: `fa-solid ${editMode ? "fa-chevron-up" : "fa-edit"}`,
            handler: () => (editMode = !editMode),
        },
    ]}
    --a5e-section-body-gap="0.75rem"
    --a5e-section-heading-gap="0.5rem"
    --a5e-section-heading-template-columns="max-content max-content"
>
    {#if editMode}
        <CheckboxGroup
            heading="A5E.MaterialProperties"
            options={Object.entries(materialProperties)}
            selected={$item.system.materialProperties}
            on:updateSelection={(event) =>
                updateDocumentDataFromField(
                    $item,
                    "system.materialProperties",
                    event.detail,
                )}
        />

        {#if $item.system.materialProperties.includes("flaw")}
            <CheckboxGroup
                heading="Flaw Properties"
                options={Object.entries(flaws)}
                selected={$item.system.flaws}
                on:updateSelection={(event) =>
                    updateDocumentDataFromField(
                        $item,
                        "system.flaws",
                        event.detail,
                    )}
            />
        {/if}
    {:else}
        <dl class="a5e-box u-flex u-flex-col u-gap-sm u-m-0 u-p-md u-text-sm">
            <div class="u-flex u-gap-md">
                <dt class="u-text-bold">
                    {localize("A5E.MaterialProperties")}:
                </dt>

                <dd class="u-m-0 u-p-0">
                    {selectedMaterialProperties || localize("A5E.None")}
                </dd>
            </div>
        </dl>
    {/if}
</Section>
