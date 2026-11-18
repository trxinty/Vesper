/**
 * VESPER MOBILE — PHASE 1 CORE ENGINE
 * 1:1 Discord Mobile 3-Panel Gesture Viewport, Relational State Store,
 * 7-Minute Message Grouping, AST Markdown Parser, Reply Spines & Role Hoisting.
 */

const STORAGE_KEY = 'vesper_mobile_state_v1';
const SEVEN_MINUTES_MS = 7 * 60 * 1000;

/* ==========================================================================
   1. INITIAL SEED DATA (Realistic Pre-Populated Guilds, Roles & Chat Histories)
   ========================================================================== */
function createInitialSeedState() {
  const now = Date.now();
  const min = 60 * 1000;

  return {
    meta: {
      version: '1.0.0',
      seededAt: now
    },
    ui: {
      activeNavTab: 'servers',
      viewportState: 'CENTER_ACTIVE', // 'LEFT_OPEN' | 'CENTER_ACTIVE' | 'RIGHT_OPEN'
      activeGuildId: 'g_vesper_hq',
      activeChannelId: 'c_mobile_arch',
      rightDrawerTab: 'members',      // 'members' | 'pins' | 'threads'
      replyingToMessageId: null,
      expandedFolders: { f_eng: true },
      collapsedCategories: {}
    },
    currentUser: {
      id: 'u_self',
      username: 'alex.rivera',
      displayName: 'Alex Rivera',
      avatar: 'AR',
      avatarBg: '#5865F2',
      status: 'online',
      bot: false,
      customStatus: { emoji: '⚡', text: 'Shipping Vesper Phase 1' },
      rolesByGuild: {
        g_vesper_hq: ['r_architect', 'r_staff'],
        g_shader_lab: ['r_shader_lead'],
        g_design_tokens: ['r_maintainer']
      }
    },
    users: {
      u_self: {
        id: 'u_self',
        username: 'alex.rivera',
        displayName: 'Alex Rivera',
        avatar: 'AR',
        avatarBg: '#5865F2',
        status: 'online',
        bot: false,
        customStatus: { emoji: '⚡', text: 'Shipping Vesper Phase 1' },
        rolesByGuild: {
          g_vesper_hq: ['r_architect', 'r_staff'],
          g_shader_lab: ['r_shader_lead'],
          g_design_tokens: ['r_maintainer']
        }
      },
      u_sara: {
        id: 'u_sara',
        username: 'sara.chen',
        displayName: 'Sara Chen',
        avatar: 'SC',
        avatarBg: '#EB459E',
        status: 'online',
        bot: false,
        customStatus: { emoji: '🎯', text: 'Tuning spring gesture curves' },
        rolesByGuild: {
          g_vesper_hq: ['r_architect'],
          g_shader_lab: ['r_shader_lead'],
          g_design_tokens: ['r_maintainer']
        }
      },
      u_marcus: {
        id: 'u_marcus',
        username: 'marcus.vance',
        displayName: 'Marcus Vance',
        avatar: 'MV',
        avatarBg: '#23A55A',
        status: 'idle',
        bot: false,
        customStatus: { emoji: '☕', text: 'Profiling IndexedDB transactions' },
        rolesByGuild: {
          g_vesper_hq: ['r_staff'],
          g_shader_lab: ['r_member'],
          g_design_tokens: ['r_maintainer']
        }
      },
      u_elena: {
        id: 'u_elena',
        username: 'elena.rostova',
        displayName: 'Elena Rostova',
        avatar: 'ER',
        avatarBg: '#F0B232',
        status: 'dnd',
        bot: false,
        customStatus: { emoji: '🔕', text: 'Deep work — WebRTC Voice Sheet' },
        rolesByGuild: {
          g_vesper_hq: ['r_staff'],
          g_shader_lab: ['r_shader_lead'],
          g_design_tokens: ['r_member']
        }
      },
      u_bot_vesper: {
        id: 'u_bot_vesper',
        username: 'vesper.ci',
        displayName: 'Vesper Telemetry',
        avatar: 'VT',
        avatarBg: '#5865F2',
        status: 'online',
        bot: true,
        customStatus: { emoji: '🟢', text: 'Watching GitHub Pages deploys' },
        rolesByGuild: {
          g_vesper_hq: ['r_bot'],
          g_shader_lab: ['r_bot'],
          g_design_tokens: ['r_bot']
        }
      },
      u_kaito: {
        id: 'u_kaito',
        username: 'kaito.t',
        displayName: 'Kaito Takahashi',
        avatar: 'KT',
        avatarBg: '#3BA55C',
        status: 'online',
        bot: false,
        customStatus: { emoji: '🎨', text: 'Auditing dark mode contrast' },
        rolesByGuild: {
          g_vesper_hq: ['r_member'],
          g_shader_lab: ['r_member'],
          g_design_tokens: ['r_maintainer']
        }
      },
      u_aria: {
        id: 'u_aria',
        username: 'aria.lin',
        displayName: 'Aria Lin',
        avatar: 'AL',
        avatarBg: '#9B59B6',
        status: 'offline',
        bot: false,
        customStatus: null,
        rolesByGuild: {
          g_vesper_hq: ['r_member'],
          g_shader_lab: ['r_member'],
          g_design_tokens: ['r_member']
        }
      },
      u_liam: {
        id: 'u_liam',
        username: 'liam.dev',
        displayName: 'Liam O’Connor',
        avatar: 'LO',
        avatarBg: '#E67E22',
        status: 'offline',
        bot: false,
        customStatus: null,
        rolesByGuild: {
          g_vesper_hq: ['r_member'],
          g_shader_lab: ['r_member'],
          g_design_tokens: ['r_member']
        }
      }
    },
    folders: [
      {
        id: 'f_eng',
        name: 'UI & Graphics Labs',
        color: '#5865F2',
        guildIds: ['g_shader_lab', 'g_design_tokens']
      }
    ],
    guilds: [
      {
        id: 'g_vesper_hq',
        name: 'Vesper Core HQ',
        iconText: 'VC',
        iconBg: 'linear-gradient(135deg, #5865F2 0%, #3B44B1 100%)',
        bannerBg: 'linear-gradient(135deg, #2b2d42 0%, #5865f2 100%)',
        verified: true,
        inFolderId: null,
        memberIds: ['u_self', 'u_sara', 'u_marcus', 'u_elena', 'u_bot_vesper', 'u_kaito', 'u_aria', 'u_liam']
      },
      {
        id: 'g_shader_lab',
        name: 'WebGPU & Shaders',
        iconText: 'WG',
        iconBg: 'linear-gradient(135deg, #EB459E 0%, #8E24AA 100%)',
        bannerBg: 'linear-gradient(135deg, #4a154b 0%, #eb459e 100%)',
        verified: true,
        inFolderId: 'f_eng',
        memberIds: ['u_self', 'u_sara', 'u_elena', 'u_bot_vesper', 'u_kaito', 'u_aria']
      },
      {
        id: 'g_design_tokens',
        name: 'Design Systems 1:1',
        iconText: 'DS',
        iconBg: 'linear-gradient(135deg, #23A55A 0%, #116B36 100%)',
        bannerBg: 'linear-gradient(135deg, #134e5e 0%, #23a55a 100%)',
        verified: false,
        inFolderId: 'f_eng',
        memberIds: ['u_self', 'u_sara', 'u_marcus', 'u_kaito', 'u_bot_vesper', 'u_liam']
      }
    ],
    roles: {
      g_vesper_hq: [
        { id: 'r_architect', name: 'CORE ARCHITECT', color: '#F47FFF', position: 4, hoist: true },
        { id: 'r_staff', name: 'STAFF ENGINEER', color: '#57F287', position: 3, hoist: true },
        { id: 'r_bot', name: 'SYSTEM BOTS', color: '#5865F2', position: 2, hoist: true },
        { id: 'r_member', name: 'CONTRIBUTOR', color: '#949BA4', position: 1, hoist: false }
      ],
      g_shader_lab: [
        { id: 'r_shader_lead', name: 'SHADER ARCHITECT', color: '#FF73FA', position: 3, hoist: true },
        { id: 'r_bot', name: 'AUTOMATION', color: '#5865F2', position: 2, hoist: true },
        { id: 'r_member', name: 'GRAPHICS DEV', color: '#949BA4', position: 1, hoist: false }
      ],
      g_design_tokens: [
        { id: 'r_maintainer', name: 'TOKEN MAINTAINER', color: '#2ECC71', position: 3, hoist: true },
        { id: 'r_bot', name: 'BOTS', color: '#5865F2', position: 2, hoist: true },
        { id: 'r_member', name: 'DESIGNER', color: '#949BA4', position: 1, hoist: false }
      ]
    },
    categories: [
      { id: 'cat_v_info', guildId: 'g_vesper_hq', name: 'START HERE', position: 0 },
      { id: 'cat_v_eng', guildId: 'g_vesper_hq', name: 'MOBILE ENGINEERING', position: 1 },
      { id: 'cat_v_voice', guildId: 'g_vesper_hq', name: 'VOICE LOUNGES', position: 2 },

      { id: 'cat_s_main', guildId: 'g_shader_lab', name: 'SHADER PIPELINE', position: 0 },
      { id: 'cat_d_main', guildId: 'g_design_tokens', name: 'TOKEN SPECS', position: 0 }
    ],
    channels: [
      {
        id: 'c_announcements',
        guildId: 'g_vesper_hq',
        categoryId: 'cat_v_info',
        name: 'announcements',
        type: 'announcement',
        topic: 'Official Vesper milestone releases, architecture blueprints, and GitHub Pages builds.',
        position: 0
      },
      {
        id: 'c_mobile_arch',
        guildId: 'g_vesper_hq',
        categoryId: 'cat_v_eng',
        name: 'mobile-architecture',
        type: 'text',
        topic: '1:1 Discord Mobile layout mechanics, 3-panel sliding physics, and relational state persistence.',
        position: 0
      },
      {
        id: 'c_gesture_physics',
        guildId: 'g_vesper_hq',
        categoryId: 'cat_v_eng',
        name: 'gesture-physics',
        type: 'text',
        topic: 'Touch delta tracking, cubic-bezier spring curves, and drawer snap thresholds.',
        position: 1
      },
      {
        id: 'c_markdown_ast',
        guildId: 'g_vesper_hq',
        categoryId: 'cat_v_eng',
        name: 'markdown-parser',
        type: 'forum',
        topic: 'Testing spoilers, syntax highlighted code blocks, blockquotes, and @mentions.',
        position: 2
      },
      {
        id: 'c_voice_standup',
        guildId: 'g_vesper_hq',
        categoryId: 'cat_v_voice',
        name: 'Daily UI Standup',
        type: 'voice',
        topic: 'Active voice huddle',
        position: 0,
        connectedUsers: [
          { userId: 'u_sara', speaking: true, streaming: true },
          { userId: 'u_marcus', speaking: false, streaming: false }
        ]
      },
      {
        id: 'c_shader_general',
        guildId: 'g_shader_lab',
        categoryId: 'cat_s_main',
        name: 'wgsl-compute',
        type: 'text',
        topic: 'WebGPU compute shaders and real-time framebuffers.',
        position: 0
      },
      {
        id: 'c_tokens_audit',
        guildId: 'g_design_tokens',
        categoryId: 'cat_d_main',
        name: 'onyx-dark-theme',
        type: 'text',
        topic: 'Exact Discord Onyx/Midnight hex mappings and elevation tokens.',
        position: 0
      }
    ],
    readStates: {
      c_announcements: { unreadCount: 2, mentionCount: 1 },
      c_mobile_arch: { unreadCount: 0, mentionCount: 0 },
      c_gesture_physics: { unreadCount: 4, mentionCount: 0 },
      c_markdown_ast: { unreadCount: 0, mentionCount: 0 },
      c_shader_general: { unreadCount: 3, mentionCount: 2 },
      c_tokens_audit: { unreadCount: 1, mentionCount: 0 }
    },
    threadsByChannel: {
      c_mobile_arch: [
        { id: 't_1', title: '3-Panel translate3d GPU compositing benchmarks', author: 'Sara Chen', messageCount: 18, lastActive: '14m ago' },
        { id: 't_2', title: '7-Minute message grouping edge cases with replies', author: 'Marcus Vance', messageCount: 9, lastActive: '1h ago' }
      ]
    },
    messages: {
      c_mobile_arch: [
        {
          id: 'm_101',
          channelId: 'c_mobile_arch',
          authorId: 'u_sara',
          content: 'Welcome to **Vesper Mobile**! We have replicated Discord Mobile’s **3-Panel Sliding Gesture Viewport** with hardware-accelerated transitions.',
          timestamp: now - 42 * min,
          editedAt: null,
          pinned: true,
          replyToId: null,
          reactions: [
            { emoji: '🔥', userIds: ['u_self', 'u_marcus', 'u_elena'] },
            { emoji: '🚀', userIds: ['u_self', 'u_kaito'] }
          ]
        },
        {
          id: 'm_102',
          channelId: 'c_mobile_arch',
          authorId: 'u_sara',
          content: 'Notice how consecutive messages from the same author within **7 minutes** automatically collapse into a compact continuation row! Hover or tap this row to inspect the left-gutter timestamp.',
          timestamp: now - 40 * min,
          editedAt: null,
          pinned: false,
          replyToId: null,
          reactions: []
        },
        {
          id: 'm_103',
          channelId: 'c_mobile_arch',
          authorId: 'u_marcus',
          content: 'Testing the full **Discord Markdown AST engine**:\n> Multi-line blockquotes with **bold**, *italics*, __underline__, ~~strikethrough~~, and inline `translate3d(320px, 0, 0)` tokens.\nTap this spoiler tag to reveal the secret token: ||Onyx Dark Theme #111214||',
          timestamp: now - 25 * min,
          editedAt: null,
          pinned: true,
          replyToId: 'm_101',
          reactions: [
            { emoji: '⚡', userIds: ['u_sara', 'u_self'] }
          ]
        },
        {
          id: 'm_104',
          channelId: 'c_mobile_arch',
          authorId: 'u_bot_vesper',
          content: 'Build `vesper-phase-1` passed static verification for `@Alex Rivera` in `#mobile-architecture`.\n```js\nconst snapPanel = (deltaX, velocity) => {\n  return Math.abs(deltaX) > 78 || Math.abs(velocity) > 0.45;\n};\n```',
          timestamp: now - 12 * min,
          editedAt: null,
          pinned: false,
          replyToId: null,
          reactions: [
            { emoji: '✅', userIds: ['u_self', 'u_sara', 'u_marcus'] }
          ]
        },
        {
          id: 'm_105',
          channelId: 'c_mobile_arch',
          authorId: 'u_elena',
          content: 'Swipe right (or tap the top-left menu button) to see the **72px Server Rail**, collapsible **Server Folders**, and the **Persistent Bottom Navigation Tab Bar** appear automatically. Swipe left (or tap the top-right members icon) to inspect **Role Hoisting**!',
          timestamp: now - 4 * min,
          editedAt: null,
          pinned: false,
          replyToId: 'm_104',
          reactions: [
            { emoji: '💜', userIds: ['u_self'] }
          ]
        }
      ],
      c_announcements: [
        {
          id: 'm_201',
          channelId: 'c_announcements',
          authorId: 'u_sara',
          content: '📣 **Phase 1 Core Shell is Live!** Every message, reaction, reply, and channel read-state is persisted automatically in `localStorage` for `@Alex Rivera`.',
          timestamp: now - 120 * min,
          editedAt: null,
          pinned: true,
          replyToId: null,
          reactions: [{ emoji: '🎉', userIds: ['u_self', 'u_marcus', 'u_kaito'] }]
        }
      ],
      c_gesture_physics: [
        {
          id: 'm_301',
          channelId: 'c_gesture_physics',
          authorId: 'u_marcus',
          content: 'When the Left Drawer is open, the Center Chat Panel shifts by `320px`, rounds its left corners to `18px`, and shrinks its bottom offset by `58px` so the **Bottom Navigation Tab Bar** slides up cleanly underneath.',
          timestamp: now - 55 * min,
          editedAt: null,
          pinned: false,
          replyToId: null,
          reactions: [{ emoji: '👌', userIds: ['u_sara'] }]
        }
      ],
      c_markdown_ast: [
        {
          id: 'm_401',
          channelId: 'c_markdown_ast',
          authorId: 'u_kaito',
          content: 'Try clicking the **+** button in the chat composer below to insert a rich Markdown showcase template, or type any message with `**bold**`, `||spoiler||`, or `@Sara Chen`!',
          timestamp: now - 30 * min,
          editedAt: null,
          pinned: false,
          replyToId: null,
          reactions: []
        }
      ],
      c_shader_general: [
        {
          id: 'm_501',
          channelId: 'c_shader_general',
          authorId: 'u_elena',
          content: 'Welcome to **WebGPU & Shaders** inside the collapsible Engineering Server Folder! `@Alex Rivera` check out the compute pass timing.',
          timestamp: now - 80 * min,
          editedAt: null,
          pinned: false,
          replyToId: null,
          reactions: [{ emoji: '✨', userIds: ['u_self'] }]
        }
      ],
      c_tokens_audit: [
        {
          id: 'm_601',
          channelId: 'c_tokens_audit',
          authorId: 'u_kaito',
          content: 'Token verification complete: `--bg-tertiary: #111214`, `--bg-secondary: #1a1b1e`, `--bg-primary: #222327`.',
          timestamp: now - 95 * min,
          editedAt: null,
          pinned: false,
          replyToId: null,
          reactions: []
        }
      ]
    }
  };
}

/* ==========================================================================
   2. RELATIONAL STATE STORE (localStorage Persistence & Action Dispatchers)
   ========================================================================== */
class VesperStore {
  constructor() {
    this.state = this.loadState();
    this.listeners = new Set();
  }

  loadState() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed && parsed.meta && parsed.guilds) {
          return parsed;
        }
      }
    } catch (err) {
      console.warn('VesperStore fallback to seed state:', err);
    }
    const seed = createInitialSeedState();
    this.saveState(seed);
    return seed;
  }

  saveState(nextState = this.state) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(nextState));
    } catch (err) {
      console.warn('Failed to persist state:', err);
    }
  }

  subscribe(fn) {
    this.listeners.add(fn);
    return () => this.listeners.delete(fn);
  }

  notify() {
    this.saveState();
    this.listeners.forEach((fn) => fn(this.state));
  }

  resetToSeed() {
    this.state = createInitialSeedState();
    this.notify();
  }

  getActiveGuild() {
    return this.state.guilds.find((g) => g.id === this.state.ui.activeGuildId) || this.state.guilds[0];
  }

  getActiveChannel() {
    return (
      this.state.channels.find((c) => c.id === this.state.ui.activeChannelId) ||
      this.state.channels.find((c) => c.guildId === this.state.ui.activeGuildId && c.type !== 'voice')
    );
  }

  getGuildUnreadStats(guildId) {
    const guildChannels = this.state.channels.filter((c) => c.guildId === guildId);
    let unread = 0;
    let mentions = 0;
    guildChannels.forEach((ch) => {
      const rs = this.state.readStates[ch.id];
      if (rs) {
        unread += rs.unreadCount || 0;
        mentions += rs.mentionCount || 0;
      }
    });
    return { unread, mentions };
  }

  getTotalGlobalPings() {
    let total = 0;
    Object.values(this.state.readStates).forEach((rs) => {
      total += rs.mentionCount || 0;
    });
    return total;
  }

  setViewportState(nextViewportState) {
    this.state.ui.viewportState = nextViewportState;
    this.notify();
  }

  selectGuild(guildId) {
    this.state.ui.activeGuildId = guildId;
    this.state.ui.activeNavTab = 'servers';
    const firstText = this.state.channels.find((c) => c.guildId === guildId && c.type !== 'voice');
    if (firstText) {
      this.state.ui.activeChannelId = firstText.id;
      this.clearChannelUnread(firstText.id);
    }
    this.notify();
  }

  selectChannel(channelId, closeDrawer = true) {
    const channel = this.state.channels.find((c) => c.id === channelId);
    if (!channel) return;
    if (channel.type === 'voice') {
      showToast(`🔊 Connected to ${channel.name} (Full Voice Sheet in Phase 2)`);
      return;
    }
    this.state.ui.activeChannelId = channelId;
    this.state.ui.replyingToMessageId = null;
    this.clearChannelUnread(channelId);
    if (closeDrawer) {
      this.state.ui.viewportState = 'CENTER_ACTIVE';
    }
    this.notify();
  }

  clearChannelUnread(channelId) {
    if (this.state.readStates[channelId]) {
      this.state.readStates[channelId].unreadCount = 0;
      this.state.readStates[channelId].mentionCount = 0;
    }
  }

  toggleFolder(folderId) {
    const curr = !!this.state.ui.expandedFolders[folderId];
    this.state.ui.expandedFolders[folderId] = !curr;
    this.notify();
  }

  toggleCategory(categoryId) {
    const curr = !!this.state.ui.collapsedCategories[categoryId];
    this.state.ui.collapsedCategories[categoryId] = !curr;
    this.notify();
  }

  setRightDrawerTab(tabName) {
    this.state.ui.rightDrawerTab = tabName;
    this.notify();
  }

  setNavTab(tabName) {
    this.state.ui.activeNavTab = tabName;
    this.notify();
  }

  setReplyingTo(messageId) {
    this.state.ui.repl
