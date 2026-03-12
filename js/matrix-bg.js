// ===================================================
// MATRIX BACKGROUND - Subtle & Easy on Eyes
// Gentle network nodes + very faint code rain
// ===================================================

(function () {
    'use strict';

    const canvas = document.getElementById('matrixCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let W, H;
    // Sparse characters - only use some symbols for a cleaner look
    const CHARS = '01<>{}()=+-;:.~|';
    const FONT_SIZE = 16;
    let columns, drops, activeColumns;

    // Fewer, gentler network nodes
    const NODE_COUNT = 20;
    let nodes = [];
    const CONNECT_DIST = 200;

    function resize() {
        W = canvas.width = window.innerWidth;
        H = canvas.height = window.innerHeight;
        columns = Math.floor(W / FONT_SIZE);
        drops = new Array(columns).fill(0).map(() => Math.random() * H / FONT_SIZE);
        // Only 20% of columns are active - much sparser
        activeColumns = new Set();
        const activeCount = Math.floor(columns * 0.15);
        while (activeColumns.size < activeCount) {
            activeColumns.add(Math.floor(Math.random() * columns));
        }
    }

    function initNodes() {
        nodes = [];
        for (let i = 0; i < NODE_COUNT; i++) {
            nodes.push({
                x: Math.random() * W,
                y: Math.random() * H,
                vx: (Math.random() - 0.5) * 0.3,
                vy: (Math.random() - 0.5) * 0.3,
                radius: Math.random() * 1.5 + 0.5,
                pulse: Math.random() * Math.PI * 2
            });
        }
    }

    function drawMatrixRain() {
        // Faster fade = shorter trails = less visual noise
        ctx.fillStyle = 'rgba(10, 10, 10, 0.12)';
        ctx.fillRect(0, 0, W, H);

        ctx.font = FONT_SIZE + 'px monospace';

        for (let i of activeColumns) {
            const char = CHARS[Math.floor(Math.random() * CHARS.length)];
            const x = i * FONT_SIZE;
            const y = drops[i] * FONT_SIZE;

            // Very dim - max opacity 0.12
            const brightness = Math.random();
            if (brightness > 0.97) {
                ctx.fillStyle = 'rgba(64, 224, 208, 0.25)'; // rare brighter flash
            } else {
                ctx.fillStyle = 'rgba(64, 224, 208, ' + (0.04 + Math.random() * 0.06) + ')';
            }

            ctx.fillText(char, x, y);

            // Reset drop - slower fall
            if (y > H && Math.random() > 0.98) {
                drops[i] = 0;
            }
            drops[i] += 0.3 + Math.random() * 0.3;
        }

        // Occasionally swap active columns for variety
        if (Math.random() > 0.99) {
            const arr = Array.from(activeColumns);
            const removeIdx = Math.floor(Math.random() * arr.length);
            activeColumns.delete(arr[removeIdx]);
            activeColumns.add(Math.floor(Math.random() * columns));
        }
    }

    function drawNodes() {
        // Update positions
        for (let node of nodes) {
            node.x += node.vx;
            node.y += node.vy;
            node.pulse += 0.015;

            if (node.x < 0 || node.x > W) node.vx *= -1;
            if (node.y < 0 || node.y > H) node.vy *= -1;
            node.x = Math.max(0, Math.min(W, node.x));
            node.y = Math.max(0, Math.min(H, node.y));
        }

        // Draw connections - very subtle
        for (let i = 0; i < nodes.length; i++) {
            for (let j = i + 1; j < nodes.length; j++) {
                const dx = nodes[i].x - nodes[j].x;
                const dy = nodes[i].y - nodes[j].y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < CONNECT_DIST) {
                    const alpha = (1 - dist / CONNECT_DIST) * 0.08;
                    ctx.beginPath();
                    ctx.moveTo(nodes[i].x, nodes[i].y);
                    ctx.lineTo(nodes[j].x, nodes[j].y);
                    ctx.strokeStyle = 'rgba(64, 224, 208, ' + alpha + ')';
                    ctx.lineWidth = 0.5;
                    ctx.stroke();
                }
            }
        }

        // Draw nodes - soft glow
        for (let node of nodes) {
            const glow = 0.15 + Math.sin(node.pulse) * 0.1;
            const r = node.radius + Math.sin(node.pulse) * 0.3;

            // Soft outer glow
            ctx.beginPath();
            ctx.arc(node.x, node.y, r + 4, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(64, 224, 208, ' + (glow * 0.08) + ')';
            ctx.fill();

            // Core dot
            ctx.beginPath();
            ctx.arc(node.x, node.y, r, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(64, 224, 208, ' + glow + ')';
            ctx.fill();
        }
    }

    // Gentle data packets
    let packets = [];
    function spawnPacket() {
        if (nodes.length < 2 || packets.length > 3) return;
        const a = Math.floor(Math.random() * nodes.length);
        let b = Math.floor(Math.random() * nodes.length);
        if (a === b) b = (a + 1) % nodes.length;
        const dx = nodes[a].x - nodes[b].x;
        const dy = nodes[a].y - nodes[b].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < CONNECT_DIST * 1.2) {
            packets.push({ from: a, to: b, t: 0, speed: 0.004 + Math.random() * 0.006 });
        }
    }

    function drawPackets() {
        for (let i = packets.length - 1; i >= 0; i--) {
            const p = packets[i];
            p.t += p.speed;
            if (p.t >= 1) { packets.splice(i, 1); continue; }

            const x = nodes[p.from].x + (nodes[p.to].x - nodes[p.from].x) * p.t;
            const y = nodes[p.from].y + (nodes[p.to].y - nodes[p.from].y) * p.t;

            ctx.beginPath();
            ctx.arc(x, y, 1.5, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(64, 224, 208, 0.4)';
            ctx.fill();

            // Soft trail
            ctx.beginPath();
            ctx.arc(x, y, 4, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(64, 224, 208, 0.06)';
            ctx.fill();
        }
    }

    let frameCount = 0;
    function animate() {
        drawMatrixRain();
        drawNodes();
        drawPackets();

        frameCount++;
        if (frameCount % 90 === 0) spawnPacket();

        requestAnimationFrame(animate);
    }

    resize();
    initNodes();
    animate();

    window.addEventListener('resize', () => {
        resize();
        initNodes();
    });

    // Gentle mouse interaction
    let mouseX = -1000, mouseY = -1000;
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    setInterval(() => {
        for (let node of nodes) {
            const dx = mouseX - node.x;
            const dy = mouseY - node.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 250 && dist > 0) {
                node.vx += (dx / dist) * 0.01;
                node.vy += (dy / dist) * 0.01;
                const speed = Math.sqrt(node.vx * node.vx + node.vy * node.vy);
                if (speed > 0.6) {
                    node.vx = (node.vx / speed) * 0.6;
                    node.vy = (node.vy / speed) * 0.6;
                }
            }
        }
    }, 60);

})();
