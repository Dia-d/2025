# How to Edit Universities Data

This guide shows you how to edit university data directly in the code by modifying the `universities.json` file.

## File Location
📁 `2025/src/data/universities.json`

## University Data Structure

Each university entry follows this structure:

```json
{
  "university-id": {
    "name": "University Name",
    "location": "US",           // 2-letter country code (ISO 3166-1 alpha-2)
    "city": "City Name",
    "specialisedsubj": ["subject1", "subject2"],  // Array of subjects
    "minimumgpa": 3.5,          // Number (0-4) or null
    "satsmin": 1500,             // Number (400-1600) or null
    "requiresToefl": true,       // Boolean or null
    "requiresIelts": false,      // Boolean or null
    "toeflMin": 100,             // Number (0-120) or null
    "ieltsMin": null,            // Number (0-9) or null
    "averagescores": {
      "gpa": 3.8,
      "sats": 1520
    },
    "tags": ["Tag1", "Tag2"]     // Array of strings
  }
}
```

## Field Descriptions

### Required Fields
- **`name`** (string): Full university name
- **`location`** (string): 2-letter country code (e.g., "US", "GB", "CA", "AU", "JP")
- **`city`** (string): City where the university is located
- **`specialisedsubj`** (array): List of subjects the university specializes in

### Optional Fields
- **`minimumgpa`** (number|null): Minimum GPA requirement (0-4 scale)
- **`satsmin`** (number|null): Minimum SAT score required (400-1600)
- **`requiresToefl`** (boolean|null): Whether TOEFL is required
- **`requiresIelts`** (boolean|null): Whether IELTS is required
- **`toeflMin`** (number|null): Minimum TOEFL score required (0-120)
- **`ieltsMin`** (number|null): Minimum IELTS score required (0-9, can be decimals like 7.0, 7.5)
- **`averagescores`** (object|null): Average scores of admitted students
  - `gpa` (number|null)
  - `sats` (number|null)
- **`tags`** (array): Descriptive tags (e.g., ["Ivy League", "Research"])

## Examples

### Example 1: US University with SAT and TOEFL
```json
"yale": {
  "name": "Yale University",
  "location": "US",
  "city": "New Haven",
  "specialisedsubj": ["law", "humanities", "business"],
  "minimumgpa": 3.7,
  "satsmin": 1500,
  "requiresToefl": true,
  "requiresIelts": false,
  "toeflMin": 100,
  "ieltsMin": null,
  "averagescores": {
    "gpa": 3.9,
    "sats": 1520
  },
  "tags": ["Ivy League", "Research", "Scholarships"]
}
```

### Example 2: UK University with IELTS (No SAT)
```json
"imperial": {
  "name": "Imperial College London",
  "location": "GB",
  "city": "London",
  "specialisedsubj": ["engineering", "data", "Computer"],
  "minimumgpa": 3.5,
  "satsmin": null,
  "requiresToefl": false,
  "requiresIelts": true,
  "toeflMin": null,
  "ieltsMin": 7.0,
  "averagescores": {
    "gpa": 3.7,
    "sats": null
  },
  "tags": ["STEM", "Research", "Innovation"]
}
```

### Example 3: University with Both TOEFL and IELTS Accepted
```json
"toronto": {
  "name": "University of Toronto",
  "location": "CA",
  "city": "Toronto",
  "specialisedsubj": ["business", "engineering", "health"],
  "minimumgpa": 3.3,
  "satsmin": null,
  "requiresToefl": true,
  "requiresIelts": true,
  "toeflMin": 100,
  "ieltsMin": 7.0,
  "averagescores": {
    "gpa": 3.6,
    "sats": null
  },
  "tags": ["Research", "Diversity", "Scholarships"]
}
```

### Example 4: University with No Language Requirements
```json
"tokyo": {
  "name": "University of Tokyo",
  "location": "JP",
  "city": "Tokyo",
  "specialisedsubj": ["engineering", "data", "Computer"],
  "minimumgpa": 3.2,
  "satsmin": null,
  "requiresToefl": null,
  "requiresIelts": null,
  "toeflMin": null,
  "ieltsMin": null,
  "averagescores": {
    "gpa": 3.6,
    "sats": null
  },
  "tags": ["AI", "Robotics", "Partnerships"]
}
```

## Available Subject Options

Common subject values you can use in `specialisedsubj`:
- `"engineering"`
- `"business"`
- `"law"`
- `"health"`
- `"humanities"`
- `"design"`
- `"data"`
- `"Computer"`
- `"doctorate"`

## Country Codes

Use ISO 3166-1 alpha-2 country codes (2 letters):
- **US** - United States
- **GB** - United Kingdom
- **CA** - Canada
- **AU** - Australia
- **JP** - Japan
- **DE** - Germany
- **FR** - France
- **FI** - Finland
- **ZA** - South Africa
- And more...

## How to Add a New University

1. Open `2025/src/data/universities.json`
2. Add a new entry with a unique ID (use lowercase, hyphenated format)
3. Copy the structure from an existing university
4. Fill in all the fields
5. Save the file
6. The changes will appear automatically when you refresh the app

### Step-by-Step Example

```json
{
  "new-university-id": {
    "name": "New University Name",
    "location": "US",
    "city": "City Name",
    "specialisedsubj": ["engineering", "business"],
    "minimumgpa": 3.0,
    "satsmin": 1400,
    "requiresToefl": true,
    "requiresIelts": false,
    "toeflMin": 90,
    "ieltsMin": null,
    "averagescores": {
      "gpa": 3.5,
      "sats": 1450
    },
    "tags": ["New", "University"]
  }
}
```

## How to Edit an Existing University

1. Find the university by its ID in `universities.json`
2. Modify any field you want to change
3. Save the file
4. Refresh the app to see changes

### Example: Updating TOEFL Requirements

**Before:**
```json
"harvard": {
  ...
  "requiresToefl": true,
  "toeflMin": 100,
  ...
}
```

**After:**
```json
"harvard": {
  ...
  "requiresToefl": true,
  "toeflMin": 110,  // Changed from 100 to 110
  ...
}
```

## Important Notes

1. **JSON Syntax**: Make sure to:
   - Use double quotes for all strings
   - Add commas between entries (except the last one)
   - Match all opening and closing braces/brackets

2. **Null Values**: Use `null` (not `"null"` or `""`) for missing/not applicable fields

3. **Boolean Values**: Use `true` or `false` (lowercase, no quotes)

4. **Numbers**: Don't use quotes around numbers

5. **Arrays**: Use square brackets `[]` for lists

6. **Validation**: After editing, make sure your JSON is valid. You can use:
   - Online JSON validators
   - VS Code will show errors if JSON is invalid

## Quick Reference

| Field | Type | Example | Required |
|-------|------|---------|----------|
| `name` | string | `"Harvard University"` | ✅ |
| `location` | string | `"US"` | ✅ |
| `city` | string | `"Cambridge"` | ✅ |
| `specialisedsubj` | array | `["law", "business"]` | ✅ |
| `minimumgpa` | number\|null | `3.6` or `null` | ❌ |
| `satsmin` | number\|null | `1500` or `null` | ❌ |
| `requiresToefl` | boolean\|null | `true`, `false`, or `null` | ❌ |
| `requiresIelts` | boolean\|null | `true`, `false`, or `null` | ❌ |
| `toeflMin` | number\|null | `100` or `null` | ❌ |
| `ieltsMin` | number\|null | `7.0` or `null` | ❌ |
| `averagescores` | object\|null | `{"gpa": 3.9, "sats": 1520}` | ❌ |
| `tags` | array | `["Ivy League", "Research"]` | ❌ |

## Testing Your Changes

After editing:
1. Save the file
2. If using a dev server, it should auto-reload
3. Check the browser console for any errors
4. Navigate to the universities page to see your changes

