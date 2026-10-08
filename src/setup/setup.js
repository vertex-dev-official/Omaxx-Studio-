const { ChannelType, PermissionFlagsBits } = require('discord.js');
const { load, save } = require('../utils/config');

const ROLE_SPECS = [
  ['👑 Founder', 'direction', 0],
  ['💼 CEO', 'direction', 0],
  ['🏢 Studio Director', 'direction', 0],
  ['🎬 Director', 'production', 0],
  ['📝 Writer', 'production', 0],
  ['🎨 Art Director', 'production', 0],
  ['✏️ Creative Designer', 'production', 0],
  ['🎞️ Video Editor', 'production', 0],
  ['🧊 3D Artist', 'production', 0],
  ['🎧 Sound Designer', 'production', 0],
  ['🛡️ Administrator', 'community', 0],
  ['🔨 Moderator', 'community', 0],
  ['🤝 Community Manager', 'community', 0],
  ['⭐ VIP', 'community', 0],
  ['👤 Member', 'community', 0]
];

const ROLE_PERMS = {
  '👑 Founder': [PermissionFlagsBits.ManageGuild, PermissionFlagsBits.ManageChannels, PermissionFlagsBits.ManageRoles, PermissionFlagsBits.ManageMessages, PermissionFlagsBits.ModerateMembers, PermissionFlagsBits.KickMembers, PermissionFlagsBits.BanMembers],
  '💼 CEO': [PermissionFlagsBits.ManageGuild, PermissionFlagsBits.ManageChannels, PermissionFlagsBits.ManageRoles, PermissionFlagsBits.ManageMessages, PermissionFlagsBits.ModerateMembers, PermissionFlagsBits.KickMembers, PermissionFlagsBits.BanMembers],
  '🏢 Studio Director': [PermissionFlagsBits.ManageGuild, PermissionFlagsBits.ManageChannels, PermissionFlagsBits.ManageMessages, PermissionFlagsBits.ModerateMembers],
  '🎬 Director': [PermissionFlagsBits.ManageMessages, PermissionFlagsBits.ManageThreads],
  '🛡️ Administrator': [PermissionFlagsBits.ManageChannels, PermissionFlagsBits.ManageMessages, PermissionFlagsBits.ModerateMembers, PermissionFlagsBits.KickMembers, PermissionFlagsBits.BanMembers],
  '🔨 Moderator': [PermissionFlagsBits.ManageMessages, PermissionFlagsBits.ModerateMembers],
  '🤝 Community Manager': [PermissionFlagsBits.ManageMessages, PermissionFlagsBits.ManageThreads]
};

const BLUEPRINT = {
  accueil: {
    label: '👋 ACCUEIL', channels: [
      ['text', '👋・bienvenue'], ['text', '✅・verifier'], ['text', '📜・regles'], ['text', '🏆・rangs']
    ]
  },
  informations: {
    label: '📌 INFORMATIONS', channels: [
      ['text', '📢・annonces'], ['text', '📰・actualites'], ['text', '👤・presentation'], ['text', '❓・faq']
    ]
  },
  studios: {
    label: '🎬 OMAXX STUDIOS', channels: [
      ['text', '🏢・a-propos'], ['text', '🎬・nos-projets'], ['text', '🚀・projets-a-venir'], ['text', '🏆・projets-termines'], ['text', '🎞️・bandes-annonces'], ['text', '🎥・making-of']
    ]
  },
  creation: {
    label: '🛠️ CRÉATION', channels: [
      ['text', '📝・scenarios'], ['text', '🎨・design'], ['text', '🖼️・miniatures'], ['text', '🎬・montage'], ['text', '🎵・musiques'], ['text', '🧱・blockbench']
    ]
  },
  communaute: {
    label: '💬 COMMUNAUTÉ', channels: [
      ['text', '💬・general'], ['text', '🎮・minecraft'], ['text', '📸・captures'], ['text', '🎨・creations'], ['text', '📹・vos-videos'], ['text', '😂・memes'], ['text', '💡・suggestions']
    ]
  },
  smp: {
    label: '🌐 NOS SMP', channels: [
      ['text', '📋・liste-des-smp'], ['text', '📈・progress-smp'], ['text', '💾・data-smp'], ['text', '🗓️・lift-smp'], ['text', '🔨・forge-smp']
    ]
  },
  partenariats: {
    label: '🤝 PARTENARIATS & 🔊 VOCAUX', channels: [
      ['text', '🤝・partenariats'], ['text', '📨・demandes-partenariat'], ['text', '📣・collaborations'],
      ['voice', '👥 Salon Principal', 50], ['voice', '🎮 Gaming', 15], ['voice', '🎬 Production', 10], ['voice', '💬 Discussion', 20],
      ['voice', '🎵 Musique', 15], ['voice', '🛡️ Staff', 8], ['voice', '👑 Direction', 5], ['voice', '🧩 Réunion SMP', 12]
    ]
  },
  gestion: {
    label: '🏢 GESTION SMP', restricted: true, channels: [
      ['text', '📊・gestion-des-smp'], ['text', '👑・responsables-smp'], ['text', '📋・candidature-responsable'], ['text', '📄・suivi-des-smp'], ['text', '⚙️・ressources-smp'], ['text', '🗓️・planning-smp'], ['text', '🚨・problèmes-smp']
    ]
  },
  equipe: {
    label: '👥 ÉQUIPE', restricted: true, channels: [
      ['text', '📋・recrutement'], ['text', '📁・projets-équipe'], ['text', '💬・discussion-équipe'], ['text', '🗓️・planning']
    ]
  },
  tickets: { label: '🎫 TICKETS', restricted: true, channels: [['text', '🎫・ouvrir-un-ticket']] },
  vocalAdmin: { label: '🎙️ ENREGISTREMENTS VOCAUX', restricted: true, channels: [['text', '🎙️・sessions-vocales']] },
  logs: { label: '📊 LOGS', restricted: true, logs: [
    ['text', '📥・member-logs'], ['text', '🛡️・moderation-logs'], ['text', '🎫・ticket-logs'], ['text', '📋・recruitment-logs'], ['text', '💡・suggestion-logs'], ['text', '⚙️・admin-logs'], ['text', '🔐・security-logs'], ['text', '🎙️・voice-logs'], ['text', '🤖・bot-logs']
  ]},
  admin: { label: '⚙️ ADMINISTRATION', restricted: true, channels: [
    ['text', '⚙️・configuration'], ['text', '📊・statistiques'], ['text', '🔑・permissions'], ['text', '🔐・securite'], ['text', '🤖・commandes-bot']
  ]}
};

const MODE_GROUPS = {
  all: Object.keys(BLUEPRINT),
  salons: ['accueil', 'informations', 'studios', 'creation', 'communaute', 'smp', 'partenariats', 'gestion', 'equipe'],
  logs: ['logs'],
  admin: ['admin'],
  roles: [],
  tickets: ['tickets'],
  vocal: ['partenariats', 'vocalAdmin'],
  communautaire: ['accueil', 'informations', 'studios', 'creation', 'communaute'],
  smp: ['smp', 'gestion'],
  equipe: ['equipe'],
  securite: ['logs', 'admin'],
  recrutement: ['equipe'],
  moderation: ['logs', 'admin'],
  suggestions: ['communaute'],
  accueil: ['accueil', 'informations']
};

const roleId = (guild, name) => guild.roles.cache.find(r => r.name === name)?.id;
const privilegedIds = guild => ROLE_SPECS.map(([name]) => roleId(guild, name)).filter(Boolean);
const staffIds = guild => ['👑 Founder', '💼 CEO', '🏢 Studio Director', '🛡️ Administrator', '🔨 Moderator', '🤝 Community Manager'].map(n => roleId(guild, n)).filter(Boolean);
const managementIds = guild => ['👑 Founder', '💼 CEO', '🏢 Studio Director', '🛡️ Administrator'].map(n => roleId(guild, n)).filter(Boolean);

function overwritesFor(guild, restricted) {
  if (!restricted) return [];
  const staff = staffIds(guild);
  return [
    { id: guild.roles.everyone.id, deny: [PermissionFlagsBits.ViewChannel] },
    ...staff.map(id => ({ id, allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages, PermissionFlagsBits.ReadMessageHistory] }))
  ];
}

async function ensureRoles(guild, result) {
  for (const [name, kind] of ROLE_SPECS) {
    let role = guild.roles.cache.find(r => r.name === name);
    if (!role) {
      role = await guild.roles.create({ name, permissions: ROLE_PERMS[name] || [], reason: 'OMAXX Studios /setup — rôles' });
      result.created.push(`Rôle ${name}`);
    } else {
      result.existing.push(`Rôle ${name}`);
      const perms = ROLE_PERMS[name];
      if (perms?.length) {
        const current = role.permissions;
        const missing = perms.some(p => !current.has(p));
        if (missing) {
          await role.setPermissions(perms, 'OMAXX Studios /setup — permissions associées').catch(() => {});
          result.modified.push(`Permissions du rôle ${name}`);
        }
      }
    }
  }
  // Place les rôles OMAXX sous le rôle du bot et dans un ordre cohérent, sans toucher aux rôles supérieurs au bot.
  const botMember = guild.members.me;
  if (botMember) {
    const ordered = ROLE_SPECS.map(([name]) => roleId(guild, name)).filter(Boolean);
    const maxPosition = Math.max(1, botMember.roles.highest.position - 1);
    let position = Math.min(maxPosition, ordered.length);
    for (const id of ordered) {
      await guild.roles.setPositions([{ role: id, position }]).catch(() => {});
      position = Math.max(1, position - 1);
    }
  }
}

async function ensureCategory(guild, name, restricted, result) {
  let category = guild.channels.cache.find(c => c.type === ChannelType.GuildCategory && c.name === name);
  const overwrites = overwritesFor(guild, restricted);
  if (!category) {
    category = await guild.channels.create({ name, type: ChannelType.GuildCategory, permissionOverwrites: overwrites, reason: 'OMAXX Studios /setup' });
    result.created.push(`Catégorie ${name}`);
  } else {
    result.existing.push(`Catégorie ${name}`);
    if (restricted) await category.permissionOverwrites.set(overwrites).catch(() => {});
  }
  return category;
}

async function ensureChannel(guild, spec, category, restricted, result) {
  const [type, name, userLimit] = spec;
  const channelType = type === 'voice' ? ChannelType.GuildVoice : ChannelType.GuildText;
  let channel = guild.channels.cache.find(c => c.type === channelType && c.name === name && c.parentId === category.id);
  if (!channel) {
    const options = { name, type: channelType, parent: category.id, reason: 'OMAXX Studios /setup' };
    if (type === 'voice') options.userLimit = userLimit || 0;
    if (restricted) options.permissionOverwrites = overwritesFor(guild, true);
    channel = await guild.channels.create(options);
    result.created.push(`Salon ${name}`);
  } else {
    result.existing.push(`Salon ${name}`);
    if (type === 'voice' && userLimit && channel.userLimit !== userLimit) {
      await channel.setUserLimit(userLimit).catch(() => {});
      result.modified.push(`Limite vocale ${name}`);
    }
    if (restricted) await channel.permissionOverwrites.set(overwritesFor(guild, true)).catch(() => {});
  }
  return channel;
}

async function applyGroup(guild, groupKey, result, config) {
  const spec = BLUEPRINT[groupKey];
  if (!spec) return;
  const category = await ensureCategory(guild, spec.label, !!spec.restricted, result);
  for (const ch of spec.channels || []) {
    const channel = await ensureChannel(guild, ch, category, !!spec.restricted, result);
    if (ch[1] === '👋・bienvenue') config.welcome.channelId = channel.id;
    if (ch[1] === '💬・general') { config.leave.channelId = channel.id; if (!config.welcome.channelId) config.welcome.channelId = channel.id; }
    if (ch[1] === '💡・suggestions') config.suggestions.channelId = channel.id;
    if (ch[1] === '📋・recrutement') config.recruitment.channelId = channel.id;
    if (ch[1] === '🎙️・studio-enregistre') config.voice.channels.push(channel.id);
    if (ch[0] === 'voice') config.voice.channels.push(channel.id);
  }
  if (groupKey === 'tickets') {
    config.tickets.categoryId = category.id;
    const panel = guild.channels.cache.find(c => c.type === ChannelType.GuildText && c.name === '🎫・ouvrir-un-ticket' && c.parentId === category.id);
    if (panel) {
      const marker = await panel.messages.fetch({limit: 20}).catch(() => null);
      const hasPanel = marker?.some(m => m.author?.id === guild.client.user.id && m.content.includes('OMAXX-TICKET-PANEL'));
      if (!hasPanel) {
        await panel.send({content:'OMAXX-TICKET-PANEL', embeds:[{title:'🎫 OMAXX Studios — Support',description:'Choisissez le type de demande avec **/ticket** pour ouvrir un espace privé.\n\n🆘 Support • 🤝 Partenariat • 📋 Recrutement • 🎬 Projet • 🚨 Signalement • ❓ Autre',color:0x8B5CF6,footer:{text:'OMAXX Studios Entertainment'}}]}).catch(() => {});
      }
    }
  }
  if (groupKey === 'logs') {
    config.logs.categoryId = category.id;
    config.logs.channels = config.logs.channels || {};
    const logKeys = {
      '📥・member-logs':'member', '🛡️・moderation-logs':'moderation', '🎫・ticket-logs':'ticket',
      '📋・recruitment-logs':'recruitment', '💡・suggestion-logs':'suggestion', '⚙️・admin-logs':'admin',
      '🔐・security-logs':'security', '🎙️・voice-logs':'voice', '🤖・bot-logs':'bot'
    };
    for (const [, name] of spec.logs || []) {
      const ch = guild.channels.cache.find(c => c.type === ChannelType.GuildText && c.name === name && c.parentId === category.id);
      if (ch) config.logs.channels[logKeys[name] || name] = ch.id;
    }
  }
  if (groupKey === 'admin') config.adminCategoryId = category.id;
}

async function setupGuild(guild, mode = 'all') {
  const config = load(guild.id);
  const result = { mode, created: [], existing: [], modified: [], errors: [] };
  try {
    await guild.channels.fetch();
    await guild.roles.fetch();
    if (mode === 'roles' || mode === 'all') await ensureRoles(guild, result);
    if (mode !== 'roles') {
      const groups = MODE_GROUPS[mode] || MODE_GROUPS.all;
      // Pour un setup complet, les rôles doivent exister avant les permissions de salons.
      if (mode !== 'roles') await ensureRoles(guild, result);
      for (const group of groups) await applyGroup(guild, group, result, config);
      // Rôle staff par défaut pour tickets/recrutement.
      config.tickets.staffRoleId ||= roleId(guild, '🛡️ Administrator');
      config.recruitment.staffRoleId ||= roleId(guild, '🤝 Community Manager');
      config.voice.admins = config.voice.admins?.length ? config.voice.admins : managementIds(guild);
      config.voice.channels = [...new Set(config.voice.channels || [])];
      save(guild.id, config);
    }
    return result;
  } catch (error) {
    result.errors.push(error?.message || String(error));
    return result;
  }
}

module.exports = { setupGuild, BLUEPRINT, MODE_GROUPS, ROLE_SPECS };
