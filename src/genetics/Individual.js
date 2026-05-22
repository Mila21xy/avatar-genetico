/**
 * Individual.js
 * Representa un agente con su genoma (DNA) y lógica de decisión.
 * 
 * DNA: array de números [0..1] con longitud DNA_LENGTH.
 * Cada índice i representa el "frame" i de la simulación.
 * Si DNA[i] > JUMP_THRESHOLD → el agente salta en ese frame.
 */

const DNA_LENGTH     = 200; // número de decisiones (frames)
const JUMP_THRESHOLD = 0.5; // umbral para saltar
const MUTATION_RATE  = 0.05; // 5% de probabilidad de mutar cada gen

class Individual {

    // ── Constructor ────────────────────────────────────────────────
    constructor(dna = null) {
        // Si no se pasa DNA, crear uno aleatorio
        this.dna = dna ? [...dna] : Individual.randomDNA();
        this.fitness = 0;
    }

    // ── DNA Aleatorio ──────────────────────────────────────────────
    static randomDNA() {
        const dna = [];
        for (let i = 0; i < DNA_LENGTH; i++) {
            dna.push(Math.random()); // valor entre 0 y 1
        }
        return dna;
    }

    // ── Decidir si saltar en el frame actual ───────────────────────
    // frameIndex: número del frame actual de la simulación
    shouldJump(frameIndex) {
        const idx = frameIndex % DNA_LENGTH; // circular (por si acaso)
        return this.dna[idx] > JUMP_THRESHOLD;
    }

    // ── Crossover (recombinación de dos padres) ────────────────────
    // Toma la primera mitad del DNA del padre A
    // y la segunda mitad del DNA del padre B
    static crossover(parentA, parentB) {
        const cutPoint = Math.floor(DNA_LENGTH / 2);
        const childDNA = [
            ...parentA.dna.slice(0, cutPoint),    // genes del padre A
            ...parentB.dna.slice(cutPoint)         // genes del padre B
        ];
        return new Individual(childDNA);
    }

    // ── Mutación ───────────────────────────────────────────────────
    // Con MUTATION_RATE de probabilidad, cada gen se reemplaza
    // por un valor aleatorio nuevo
    mutate() {
        for (let i = 0; i < this.dna.length; i++) {
            if (Math.random() < MUTATION_RATE) {
                this.dna[i] = Math.random(); // gen nuevo aleatorio
            }
        }
        return this; // permite encadenar: new Individual().mutate()
    }
}