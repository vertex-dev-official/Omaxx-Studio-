const {load}=require('./config');const {brandEmbed}=require('./theme');
const {PermissionFlagsBits}=require('discord.js');
function ownerOnly(i){return Boolean(i.guild&&i.guild.ownerId===i.user.id)}
function staff(i){return Boolean(ownerOnly(i)||i.memberPermissions?.has(PermissionFlagsBits.ManageGuild)||i.memberPermissions?.has(PermissionFlagsBits.Administrator))}
async function reply(i,content,ephemeral=true){const c=i.guild?load(i.guild.id):null;const payload=typeof content==='string'&&c?{embeds:[brandEmbed(c,{title:'OMAXX Studios',description:content})],ephemeral}:content;if(i.replied||i.deferred)return i.followUp(payload);return i.reply(payload);}
function canTarget(i,target){if(!target||target.id===i.user.id||target.id===i.guild.ownerId)return false;return i.member.roles.highest.position>target.roles.highest.position;}
function hasAnyRole(i,ids=[]){return ids.some(id=>i.member?.roles?.cache?.has(id))}
module.exports={ownerOnly,staff,reply,canTarget,hasAnyRole};
