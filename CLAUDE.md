# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository layout

This repo currently contains a single Spring Boot backend, `vella-backend/`, plus IntelliJ project files at the root. `vella-backend/` has its own nested `.git` directory (it is not registered as a git submodule) — be aware that `git` commands run from the repo root will not see changes inside `vella-backend/`; `cd` into it (or target it explicitly) for version control operations there.

## Commands (run from `vella-backend/`)

- Build: `./mvnw clean install` (or `mvnw.cmd clean install` on Windows cmd)
- Run the app: `./mvnw spring-boot:run`
- Run all tests: `./mvnw test`
- Run a single test class: `./mvnw test -Dtest=VellaBackendApplicationTests`
- Run a single test method: `./mvnw test -Dtest=VellaBackendApplicationTests#contextLoads`

The app requires a local PostgreSQL instance reachable per `src/main/resources/application.yaml` (`jdbc:postgresql://localhost:5432/vellatech_db`, user/pass `postgres`/`postgres`). `ddl-auto: update` means Hibernate manages schema migrations automatically — no separate migration tool/step exists yet.

## Architecture

Vella Backend is a **multi-tenant e-commerce API**: a single deployment serves multiple independent storefronts ("stores"), each with its own catalog. The core domain model:

- **Store** (`store/`) — a tenant, identified by a unique `slug` (e.g. `belleza`, `tecnologia`) and optionally a custom `domain` (e.g. `belleza.vellatech.co`). All other domain data is scoped to a store.
- **Category** (`category/`) — belongs to exactly one `Store`.
- **Product** (`product/`) — belongs to one `Store` and optionally one `Category`; has a list of `ProductImage`s (cascaded, `orphanRemoval = true`) with `primary`/`displayOrder` flags for gallery ordering.
- **ProductImage** (`product/`) — image URLs point to Cloudinary (not stored locally).

Package-per-feature: each domain concept lives in its own package (`store/`, `category/`, `product/`) containing its `@Entity`, `*Repository` (Spring Data JPA), and (for `store/`) a `*Service`. Repositories favor store-scoping query derivation, e.g. `ProductRepository.findByStoreSlugAndActiveTrue`, `CategoryRepository.findByStoreSlug` — when adding new queries/endpoints, keep them scoped by store slug/id to preserve tenant isolation.

**Known inconsistency:** the Java `package` declarations in existing source files (`co.vellatech.vellabackend.*`) do not match their actual directory path or the main application class's package (`co.vellatech.vella_backend`, with underscore — see the note in `HELP.md` about the original package name being invalid). Do not "fix" this incidentally while editing unrelated code; if consolidating package names, do it as a deliberate, isolated change since it affects every file.

Security (`spring-boot-starter-security`) and JWT config (`app.jwt.secret`/`app.jwt.expiration` in `application.yaml`) are present in configuration but no controllers, security filter chain, or JWT-issuing code exist yet — auth wiring is not yet implemented despite the dependency/config being in place. Likewise there are no `@RestController` classes yet; only entities, repositories, and one service exist so far.
