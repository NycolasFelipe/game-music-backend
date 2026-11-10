/**
 * How an active event picks its cast (ADR-0028).
 *
 * A pair's weight starts at 1. In a member conflict, each point of hostility
 * (a relationship below 0) adds {@link HOSTILITY_WEIGHT_PER_LEVEL}, so feuding
 * pairs are likelier without taking every fight. Other event types draw any
 * pair evenly. Whoever was in the band's previous event has their weight
 * multiplied by {@link RECENT_INVOLVEMENT_FACTOR}, once per member: the same
 * pair twice in a row weighs a quarter.
 */
export const HOSTILITY_WEIGHT_PER_LEVEL = 1;

/** Weight multiplier for each member who was in the previous event. */
export const RECENT_INVOLVEMENT_FACTOR = 0.5;
