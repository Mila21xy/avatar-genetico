/**
 * GeneticAlgorithm.js
 * Contiene la lógica de selección, crossover y nueva generación.
 *
 * Estrategia:
 *   1. Elitismo: el mejor agente pasa sin cambios.
 *   2. Selección por ruleta: probabilidad proporcional al fitness.
 *   3. Crossover de dos padres.
 *   4. Mutación del hijo.
 */

class GeneticAlgorithm {

    // ── Crear la próxima generación ────────────────────────────────
    // individuals: array de Individual con fitness ya calculado
    // returns:     nuevo array de Individual
    static nextGeneration(individuals) {
        const size       = individuals.length;
        const newGen     = [];

        // 1. ELITISMO: conservar el mejor sin modificar
        const elite = GeneticAlgorithm.getBest(individuals);
        newGen.push(new Individual(elite.dna)); // copia exacta

        // 2. Llenar el resto con hijos
        while (newGen.length < size) {
            const parentA = GeneticAlgorithm.selectByRoulette(individuals);
            const parentB = GeneticAlgorithm.selectByRoulette(individuals);

            const child = Individual.crossover(parentA, parentB);
            child.mutate();

            newGen.push(child);
        }

        return newGen;
    }

    // ── Selección por Ruleta ───────────────────────────────────────
    // Cada individuo tiene una probabilidad de ser elegido
    // proporcional a su fitness. Los mejores son elegidos más seguido.
    static selectByRoulette(individuals) {
        // Suma total de fitness
        const totalFitness = individuals.reduce((sum, ind) => sum + ind.fitness, 0);

        // Si todos tienen fitness 0, elegir aleatorio
        if (totalFitness === 0) {
            return individuals[Math.floor(Math.random() * individuals.length)];
        }

        // Girar la ruleta: número aleatorio entre 0 y totalFitness
        let roulette = Math.random() * totalFitness;

        // Recorrer individuos hasta que la ruleta "caiga" en uno
        for (const ind of individuals) {
            roulette -= ind.fitness;
            if (roulette <= 0) return ind;
        }

        // Fallback: devolver el último
        return individuals[individuals.length - 1];
    }

    // ── Obtener el mejor individuo ─────────────────────────────────
    static getBest(individuals) {
        return individuals.reduce((best, ind) =>
            ind.fitness > best.fitness ? ind : best
        , individuals[0]);
    }

    // ── Calcular estadísticas ──────────────────────────────────────
    static getStats(individuals) {
        const fitnesses = individuals.map(i => i.fitness);
        const best      = Math.max(...fitnesses);
        const worst     = Math.min(...fitnesses);
        const avg       = fitnesses.reduce((s, f) => s + f, 0) / fitnesses.length;
        return { best, worst, avg };
    }
}