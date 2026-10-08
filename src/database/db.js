const Database=require('better-sqlite3');const path=require('path');const fs=require('fs');
const dbPath=process.env.DATABASE_PATH||'./data/omaxx.sqlite';fs.mkdirSync(path.dirname(dbPath),{recursive:true});
const db=new Database(dbPath);db.pragma('journal_mode=WAL');
db.exec(`CREATE TABLE IF NOT EXISTS guild_config(guild_id TEXT PRIMARY KEY,data TEXT NOT NULL,updated_at TEXT NOT NULL);
CREATE TABLE IF NOT EXISTS suggestions(id INTEGER PRIMARY KEY AUTOINCREMENT,guild_id TEXT NOT NULL,user_id TEXT NOT NULL,text TEXT NOT NULL,status TEXT NOT NULL DEFAULT 'pending',message_id TEXT,channel_id TEXT,created_at TEXT NOT NULL,updated_at TEXT NOT NULL);
CREATE TABLE IF NOT EXISTS suggestion_votes(suggestion_id INTEGER NOT NULL,user_id TEXT NOT NULL,vote INTEGER NOT NULL,PRIMARY KEY(suggestion_id,user_id));
CREATE TABLE IF NOT EXISTS tickets(id INTEGER PRIMARY KEY AUTOINCREMENT,guild_id TEXT NOT NULL,channel_id TEXT NOT NULL,user_id TEXT NOT NULL,type TEXT NOT NULL,status TEXT NOT NULL DEFAULT 'open',created_at TEXT NOT NULL,closed_at TEXT);
CREATE TABLE IF NOT EXISTS ticket_members(ticket_id INTEGER NOT NULL,user_id TEXT NOT NULL,PRIMARY KEY(ticket_id,user_id));
CREATE TABLE IF NOT EXISTS applications(id INTEGER PRIMARY KEY AUTOINCREMENT,guild_id TEXT NOT NULL,user_id TEXT NOT NULL,data TEXT NOT NULL,status TEXT NOT NULL DEFAULT 'pending',note TEXT,created_at TEXT NOT NULL,updated_at TEXT NOT NULL);
CREATE TABLE IF NOT EXISTS moderation_cases(id INTEGER PRIMARY KEY AUTOINCREMENT,guild_id TEXT NOT NULL,target_id TEXT NOT NULL,moderator_id TEXT NOT NULL,action TEXT NOT NULL,reason TEXT,created_at TEXT NOT NULL);
CREATE TABLE IF NOT EXISTS voice_sessions(id INTEGER PRIMARY KEY AUTOINCREMENT,guild_id TEXT NOT NULL,channel_id TEXT NOT NULL,started_at TEXT NOT NULL,ended_at TEXT,participants TEXT NOT NULL DEFAULT '[]',recording_path TEXT,status TEXT NOT NULL DEFAULT 'metadata');
CREATE TABLE IF NOT EXISTS voice_consents(session_id INTEGER NOT NULL,user_id TEXT NOT NULL,consented_at TEXT NOT NULL,PRIMARY KEY(session_id,user_id));
CREATE TABLE IF NOT EXISTS ai_commands(id INTEGER PRIMARY KEY AUTOINCREMENT,guild_id TEXT NOT NULL,name TEXT NOT NULL,spec TEXT NOT NULL,created_at TEXT NOT NULL);
CREATE TABLE IF NOT EXISTS audit_logs(id INTEGER PRIMARY KEY AUTOINCREMENT,guild_id TEXT NOT NULL,type TEXT NOT NULL,action TEXT NOT NULL,actor_id TEXT,target_id TEXT,details TEXT,created_at TEXT NOT NULL);`);
function getConfig(id){const r=db.prepare('SELECT data FROM guild_config WHERE guild_id=?').get(id);return r?JSON.parse(r.data):{};}
function setConfig(id,data){db.prepare('INSERT INTO guild_config(guild_id,data,updated_at) VALUES(?,?,?) ON CONFLICT(guild_id) DO UPDATE SET data=excluded.data,updated_at=excluded.updated_at').run(id,JSON.stringify(data),new Date().toISOString());}
module.exports={db,getConfig,setConfig};
