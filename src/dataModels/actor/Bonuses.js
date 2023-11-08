import {
  getAbilitiesBonusContext, getDamageBonusContext, getHealingBonusContext, getSkillContext
} from './Contexts';

export function getAbilitiesBonusData() {
  const { fields } = foundry.data;
  return {
    context: new fields.SchemaField(getAbilitiesBonusContext()),
    formula: new fields.StringField({ required: true, initial: '' }),
    label: new fields.StringField({ required: true, initial: '' })
  };
}

export function getDamageBonusData() {
  const { fields } = foundry.data;
  return {
    context: new fields.SchemaField(getDamageBonusContext()),
    damageType: new fields.StringField({ required: true, initial: '' }),
    default: new fields.BooleanField({ required: true, initial: true }),
    formula: new fields.StringField({ required: true, initial: '' }),
    label: new fields.StringField({ required: true, initial: '' })
  };
}

export function getHealingBonusData() {
  const { fields } = foundry.data;
  return {
    context: new fields.SchemaField(getHealingBonusContext()),
    healingType: new fields.StringField({ required: true, initial: 'healing' }),
    formula: new fields.StringField({ required: true, initial: '' }),
    label: new fields.StringField({ required: true, initial: '' })
  };
}

export function getSkillBonusData() {
  const { fields } = foundry.data;
  return {
    context: new fields.SchemaField(getSkillContext()),
    formula: new fields.StringField({ required: true, initial: '' }),
    label: new fields.StringField({ required: true, initial: '' })
  };
}