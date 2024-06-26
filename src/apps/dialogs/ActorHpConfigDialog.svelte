<script>
    import { getContext } from "svelte";

    import FormSection from "../components/LegacyFormSection.svelte";

    import prepareHitDice from "../dataPreparationHelpers/prepareHitDice";
    import updateDocumentDataFromField from "../../utils/updateDocumentDataFromField";

    export let { document, appId } = getContext("#external").application;

    const hpFields = [
        { label: "A5E.HitPointsCurrent", updateAttribute: "value" },
        { label: "A5E.HitPointsBaseMaximum", updateAttribute: "baseMax" },
        { label: "A5E.HitPointsTemporary", updateAttribute: "temp" },
        { label: "A5E.HitPointsMaxModifier", updateAttribute: "bonus" },
    ];

    const actor = document;
    const hitDice = prepareHitDice($actor);

    $: hitDieClasses =
        $actor.type === "character"
            ? "u-flex u-gap-md"
            : "u-grid u-grid-3 u-gap-lg";

    $: hp = $actor.system.attributes.hp;
    $: disableMaxHp =
        Object.keys($actor.classes ?? {}).length ??
        !$actor.classAutomationFlags?.hitPoints ??
        false;
    $: disableHitDice = Object.keys($actor.classes ?? {}).length ?? false;
</script>

<article>
    <div class="u-flex u-flex-col u-gap-md">
        {#each hpFields as { label, updateAttribute }}
            <FormSection
                heading={label}
                --item-alignment="center"
                --label-width="7.5rem"
            >
                <div class="u-w-20">
                    <input
                        class="a5e-input"
                        type="number"
                        data-dtype="Number"
                        name="system.attributes.hp.{updateAttribute}"
                        value={hp[updateAttribute]}
                        disabled={updateAttribute === "baseMax" && disableMaxHp}
                        on:change={({ target }) =>
                            updateDocumentDataFromField(
                                $actor,
                                target.name,
                                Number(target.value),
                            )}
                    />
                </div>
            </FormSection>
        {/each}

        <hr class="a5e-rule a5e-rule--from u-my-sm" />

        <section class={`u-mt-0 ${hitDieClasses}`}>
            {#each hitDice as { die, dieSize, current, total }}
                <div class="a5e-hit-die-wrapper">
                    <div class="a5e-hit-die">
                        <span class="a5e-hit-die__label">{dieSize}</span>
                    </div>

                    <div class="a5e-hit-die__input-container">
                        <input
                            class="a5e-hit-die__quantity"
                            type="number"
                            data-dtype="Number"
                            min="0"
                            name="system.attributes.hitDice.{dieSize}.current"
                            value={current}
                            on:change={({ target }) =>
                                updateDocumentDataFromField(
                                    $actor,
                                    target.name,
                                    Number(target.value),
                                )}
                        />
                        /
                        <input
                            class="a5e-hit-die__quantity"
                            data-dtype="Number"
                            type="number"
                            min="0"
                            name="system.attributes.hitDice.{dieSize}.total"
                            disabled={disableHitDice}
                            value={total}
                            on:change={({ target }) =>
                                updateDocumentDataFromField(
                                    $actor,
                                    target.name,
                                    Number(target.value),
                                )}
                        />
                    </div>
                </div>
            {/each}
        </section>
    </div>
</article>

<style lang="scss">
    article {
        display: flex;
        flex-direction: column;
        height: 100%;
        padding: 0.75rem;
        gap: 0.5rem;
        overflow: auto;
        background: $color-sheet-background;
    }
</style>
