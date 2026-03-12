# Ecommerce Analytics Dataform BigQuery

A production-grade analytics data platform built with Dataform and BigQuery, transforming raw TheLook ecommerce data into business-ready models for sales performance, customer behaviour, and traffic analysis in Looker.

## Architecture

```
Source (Raw) → Staging → Intermediate → Mart → BI (Looker)
```

### Layers

| Layer | Description |
|-------|-------------|
| **Source** | Raw tables from the TheLook ecommerce public dataset in BigQuery |
| **Staging** | Cleaned, typed, and renamed source data. One model per source table |
| **Intermediate** | Business logic transformations and joins between staging models |
| **Mart** | Fact and dimension tables ready for reporting and dashboarding |

## Project Structure

```
definitions/
├── sources/
│   └── thelook_ecommerce.js       # Source declarations
├── staging/
│   ├── assertions/                # Referential integrity tests
│   ├── stg_orders.sqlx
│   ├── stg_order_items.sqlx
│   ├── stg_users.sqlx
│   ├── stg_events.sqlx
│   ├── stg_products.sqlx
│   ├── stg_inventory_items.sqlx
│   └── stg_distribution_centers.sqlx
├── intermediate/
│   ├── int_customers.sqlx
│   ├── int_orders_enriched.sqlx
│   ├── int_orders_financials.sqlx
│   └── int_events_cleaned.sqlx
└── marts/
    ├── facts/
    │   ├── fct_orders.sqlx
    │   ├── fct_sessions.sqlx
    │   ├── fct_events.sqlx
    │   ├── fct_funnel_time_to_steps.sqlx
    │   ├── fct_session_funnel_steps.sqlx
    │   └── fct_session_path_analysis.sqlx
    └── dimensions/
        ├── dim_customers.sqlx
        ├── dim_products.sqlx
        ├── dim_date.sqlx
        └── dim_distribution.sqlx
```

## Data Sources

All source data comes from the [TheLook Ecommerce](https://console.cloud.google.com/marketplace/product/bigquery-public-data/thelook-ecommerce) public dataset on BigQuery (`bigquery-public-data.thelook_ecommerce`).

| Source Table | Description |
|---|---|
| `orders` | Customer orders |
| `order_items` | Individual items within each order |
| `users` | Customer accounts |
| `events` | Website behavioural events |
| `products` | Product catalogue |
| `inventory_items` | Individual inventory units |
| `distribution_centers` | Warehouse and distribution locations |

## Mart Models

### Fact Tables

| Model | Description |
|---|---|
| `fct_orders` | Order-level fact table with revenue and order metrics |
| `fct_sessions` | Session-level fact table with traffic and engagement metrics |
| `fct_events` | Event-level fact table for behavioural analysis |
| `fct_funnel_time_to_steps` | Funnel timing model measuring time between key ecommerce milestones |
| `fct_session_funnel_steps` | Session-level funnel fact table tracking conversion steps |
| `fct_session_path_analysis` | Session path analysis capturing the ordered sequence of event types |

### Dimension Tables

| Model | Description |
|---|---|
| `dim_customers` | Customer dimension with demographics and lifetime metrics |
| `dim_products` | Product dimension with category, brand and pricing attributes |
| `dim_date` | Date dimension for time-based analysis |
| `dim_distribution` | Distribution center dimension with geographic attributes |

## Looker KPIs

The mart layer is designed to power the following Looker dashboards:

- **Sales Performance** — Revenue, order rates, completed orders
- **User Behaviour** — Session rates, cart rates, product engagement
- **Conversion Funnel** — Funnel drop-off, time to purchase
- **Customer Journey** — Path length distribution, most common paths
- **Traffic Performance** — Events per user, top traffic sources

## CI/CD Pipeline

| Workflow | Trigger | Action |
|---|---|---|
| `dataform-ci.yml` | Pull request to `main` | Compiles and validates Dataform project |
| `dataform-prod.yml` | Push to `main` | Runs full Dataform pipeline in BigQuery |

## Setup

### Prerequisites
- Google Cloud project with BigQuery enabled
- GitHub repository connected to Dataform
- Service account with BigQuery Data Editor and BigQuery Job User roles

### GitHub Secrets Required

| Secret | Description |
|---|---|
| `GCP_SERVICE_ACCOUNT_KEY` | GCP service account JSON key with BigQuery access |

### Running Locally

```bash
# Install Dataform CLI
npm install -g @dataform/cli

# Compile project
dataform compile --no-credentials

# Run staging models only
dataform run --tags staging

# Run full pipeline
dataform run
```

## Data Quality

Each staging model includes:
- **Primary key uniqueness** assertions (`uniqueKey`)
- **Not null** assertions on critical fields (`nonNull`)
- **Referential integrity** assertions checking foreign keys against parent tables
- **Accepted values** checks on categorical fields via `rowConditions`