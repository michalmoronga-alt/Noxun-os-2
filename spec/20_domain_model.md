# NOXUN OS 2.0 Domain Model

Define the core entities and relationships in the system:

- **Order**: unique code, client, title, date range (plan), colour, drive root folder ID.
- **ProcessTemplate**: defines ordered steps for a type of order.
- **ProcessStep**: instance of a step on an order (with type, status, date range, assignee).
- **Task**: work item associated with a step or free-standing, with status, tags, priority, assignee, date range.
- **Agreement**: structured note capturing a decision or change, with text and approver.
- **PurchaseOrder**: material/hardware order with supplier, order number, type (sheet/hardware), status, dates.

Add any additional fields and constraints needed.
