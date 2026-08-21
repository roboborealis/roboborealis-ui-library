import { generateEntities } from './generate-entities';
import { generateRelationships } from './generate-relationships';

describe('generateRelationships', () => {
  it('returns an array when called with the full entity set', () => {
    const entities = generateEntities();
    const rels = generateRelationships(entities);
    expect(Array.isArray(rels)).toBe(true);
    expect(rels.length).toBeGreaterThan(0);
  });

  it('does not throw when given only spacecraft entities (empty companies/stations/persons)', () => {
    // This is the slice(0, 15) case that caused the crash: only spacecraft in the list.
    const allEntities = generateEntities();
    const spacecraft = allEntities.filter((e) => e.type === 'spacecraft').slice(0, 10);
    expect(() => generateRelationships(spacecraft)).not.toThrow();
  });

  it('does not throw when given only company entities', () => {
    const allEntities = generateEntities();
    const companies = allEntities.filter((e) => e.type === 'company');
    expect(() => generateRelationships(companies)).not.toThrow();
  });

  it('does not throw with an empty entity array', () => {
    expect(() => generateRelationships([])).not.toThrow();
  });

  it('does not throw with a single entity', () => {
    const entity = generateEntities().slice(0, 1);
    expect(() => generateRelationships(entity)).not.toThrow();
  });

  it('produces deterministic output with the same seed', () => {
    const entities = generateEntities();
    const a = generateRelationships(entities, 'test-seed');
    const b = generateRelationships(entities, 'test-seed');
    expect(a.map((r) => r.id)).toEqual(b.map((r) => r.id));
  });

  it('every relationship references entity ids that exist in the input', () => {
    const entities = generateEntities();
    const ids = new Set(entities.map((e) => e.id));
    const rels = generateRelationships(entities);
    for (const rel of rels) {
      expect(ids.has(rel.sourceEntityId)).toBe(true);
      expect(ids.has(rel.targetEntityId)).toBe(true);
    }
  });
});
