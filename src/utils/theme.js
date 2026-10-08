const { EmbedBuilder } = require('discord.js');
const COLORS={primary:0x8B5CF6,dark:0x09090B,secondary:0x6D28D9,muted:0x18181B,success:0xA78BFA,warning:0xC084FC,danger:0xF43F5E,info:0x7C3AED};
function brandEmbed(config,{title,description,color=COLORS.primary,footer='OMAXX Studios Entertainment',timestamp=true}={}){const e=new EmbedBuilder().setColor(color).setTitle(title||'OMAXX Studios').setFooter({text:footer});if(description)e.setDescription(description);if(timestamp)e.setTimestamp();return e;}
const ok=(c,t,d)=>brandEmbed(c,{title:`🟣 ${t}`,description:d,color:COLORS.success});
const err=(c,t,d)=>brandEmbed(c,{title:`⚠️ ${t}`,description:d,color:COLORS.danger});
const info=(c,t,d)=>brandEmbed(c,{title:`◆ ${t}`,description:d,color:COLORS.primary});
module.exports={COLORS,brandEmbed,ok,err,info};
