/**
 * Stats.js
 * Maneja la gráfica de evolución y el panel de estadísticas HTML.
 * Dibuja en un <canvas> externo al juego Phaser.
 */

class StatsUI {

    constructor() {
        this.history = []; // [{best, avg, worst}]
        this.canvas  = document.getElementById('fitness-chart');
        this.ctx     = this.canvas ? this.canvas.getContext('2d') : null;
    }

    // Llamar al final de cada generación
    record(generation, stats) {
        this.history.push({ generation, ...stats });
        this.drawChart();
        this.updatePanel(generation, stats);
    }

    // ── Dibujar gráfica ──────────────────────────────────────────
    drawChart() {
        if (!this.ctx) return;
        const canvas = this.canvas;
        const ctx    = this.ctx;
        const W = canvas.width;
        const H = canvas.height;

        // Limpiar
        ctx.clearRect(0, 0, W, H);

        // Fondo
        ctx.fillStyle = '#0d0d1a';
        ctx.fillRect(0, 0, W, H);

        if (this.history.length < 2) return;

        // Escala
        const maxFit = Math.max(...this.history.map(h => h.best), 1);
        const xStep  = W / (this.history.length - 1);

        const toX = i  => i * xStep;
        const toY = v  => H - 10 - (v / maxFit) * (H - 20);

        // ── Línea AVG (azul) ──
        ctx.beginPath();
        ctx.strokeStyle = '#4cc9f0';
        ctx.lineWidth   = 2;
        this.history.forEach((h, i) => {
            i === 0
                ? ctx.moveTo(toX(i), toY(h.avg))
                : ctx.lineTo(toX(i), toY(h.avg));
        });
        ctx.stroke();

        // ── Línea BEST (dorado) ──
        ctx.beginPath();
        ctx.strokeStyle = '#ffd700';
        ctx.lineWidth   = 2.5;
        this.history.forEach((h, i) => {
            i === 0
                ? ctx.moveTo(toX(i), toY(h.best))
                : ctx.lineTo(toX(i), toY(h.best));
        });
        ctx.stroke();

        // ── Punto actual ──
        const last = this.history[this.history.length - 1];
        ctx.fillStyle = '#ffd700';
        ctx.beginPath();
        ctx.arc(toX(this.history.length - 1), toY(last.best), 4, 0, Math.PI * 2);
        ctx.fill();

        // ── Leyenda ──
        ctx.font      = '11px monospace';
        ctx.fillStyle = '#ffd700';
        ctx.fillText('● Best', 8, 14);
        ctx.fillStyle = '#4cc9f0';
        ctx.fillText('● Avg',  8, 28);
    }

    // ── Actualizar panel HTML ────────────────────────────────────
    updatePanel(generation, stats) {
        this.setText('generation',   generation);
        this.setText('best-fitness', stats.best.toFixed(1));
        this.setText('avg-fitness',  stats.avg.toFixed(1));
        this.setText('worst-fitness',stats.worst.toFixed(1));

        // Barra de progreso del mejor fitness
        const pct = Math.min((stats.best / 150) * 100, 100).toFixed(0);
        const bar = document.getElementById('fitness-bar');
        if (bar) {
            bar.style.width     = pct + '%';
            bar.textContent     = pct + '%';
        }
    }

    setText(id, value) {
        const el = document.getElementById(id);
        if (el) el.textContent = value;
    }
}