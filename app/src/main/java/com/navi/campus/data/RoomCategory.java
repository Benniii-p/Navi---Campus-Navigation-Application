package com.navi.campus.data;

import com.navi.campus.R;

public enum RoomCategory {
    OFFICE("Office", R.drawable.bg_badge_office, R.color.badge_office_text),
    LABORATORY("Laboratory", R.drawable.bg_badge_lab, R.color.badge_lab_text),
    CLASSROOM("Classroom", R.drawable.bg_badge_department, R.color.badge_department_text),
    SUPPORT("Support", R.drawable.bg_badge_support, R.color.badge_support_text),
    DEPARTMENT("Department", R.drawable.bg_badge_department, R.color.badge_department_text),
    FACULTY("Faculty", R.drawable.bg_badge_faculty, R.color.badge_faculty_text);

    private final String label;
    private final int badgeBackgroundRes;
    private final int badgeTextColorRes;

    RoomCategory(String label, int badgeBackgroundRes, int badgeTextColorRes) {
        this.label = label;
        this.badgeBackgroundRes = badgeBackgroundRes;
        this.badgeTextColorRes = badgeTextColorRes;
    }

    public String getLabel() {
        return label;
    }

    public int getBadgeBackgroundRes() {
        return badgeBackgroundRes;
    }

    public int getBadgeTextColorRes() {
        return badgeTextColorRes;
    }
}
