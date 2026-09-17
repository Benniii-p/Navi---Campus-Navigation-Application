package com.navi.campus.frontend;

import android.os.Bundle;
import android.text.Editable;
import android.text.TextWatcher;
import android.view.Gravity;
import android.view.ViewGroup;
import android.widget.EditText;
import android.widget.LinearLayout;
import android.widget.TextView;
import android.widget.Toast;

import androidx.annotation.Nullable;
import androidx.appcompat.app.AppCompatActivity;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import com.navi.campus.R;
import com.navi.campus.backend.model.RoomItem;
import com.navi.campus.backend.repository.RoomRepository;
import com.navi.campus.frontend.adapter.RoomAdapter;

import java.util.ArrayList;
import java.util.List;
import java.util.Locale;

public class FindRoomActivity extends AppCompatActivity {

    private static final String[] FILTER_OPTIONS = {"All", "Office", "Laboratory", "Classroom"};

    private final List<RoomItem> allRooms = RoomRepository.getRooms();
    private final List<TextView> filterChipViews = new ArrayList<>();

    private EditText editSearchQuery;
    private LinearLayout layoutFilterChips;
    private TextView textResultsCount;
    private RoomAdapter roomAdapter;

    private String selectedFilter = FILTER_OPTIONS[0];

    @Override
    protected void onCreate(@Nullable Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_find_room);

        editSearchQuery = findViewById(R.id.editSearchQuery);
        layoutFilterChips = findViewById(R.id.layoutFilterChips);
        textResultsCount = findViewById(R.id.textResultsCount);

        findViewById(R.id.buttonBack).setOnClickListener(v -> onBackPressed());

        setUpRecyclerView();
        setUpFilterChips();
        setUpSearchField();
        setUpBottomNav();

        applyFilters();
    }

    private void setUpRecyclerView() {
        RecyclerView recyclerRooms = findViewById(R.id.recyclerRooms);
        recyclerRooms.setLayoutManager(new LinearLayoutManager(this));
        roomAdapter = new RoomAdapter(room ->
                Toast.makeText(this, room.getName(), Toast.LENGTH_SHORT).show());
        recyclerRooms.setAdapter(roomAdapter);
    }

    private void setUpFilterChips() {
        for (String option : FILTER_OPTIONS) {
            TextView chip = createChipView(option);
            chip.setOnClickListener(v -> {
                selectedFilter = option;
                refreshChipStyles();
                applyFilters();
            });
            filterChipViews.add(chip);
            layoutFilterChips.addView(chip);
        }
        refreshChipStyles();
    }

    private TextView createChipView(String label) {
        TextView chip = new TextView(this);
        chip.setText(label);
        chip.setTextSize(14f);
        chip.setTag(label);
        int paddingH = dp(16);
        int paddingV = dp(8);
        chip.setPadding(paddingH, paddingV, paddingH, paddingV);
        chip.setGravity(Gravity.CENTER);

        LinearLayout.LayoutParams params = new LinearLayout.LayoutParams(
                ViewGroup.LayoutParams.WRAP_CONTENT, ViewGroup.LayoutParams.WRAP_CONTENT);
        params.setMarginEnd(dp(8));
        chip.setLayoutParams(params);
        return chip;
    }

    private void refreshChipStyles() {
        for (TextView chip : filterChipViews) {
            boolean isSelected = chip.getTag().equals(selectedFilter);
            chip.setBackgroundResource(isSelected ? R.drawable.bg_chip_selected : R.drawable.bg_chip_unselected);
            chip.setTextColor(getColor(isSelected ? R.color.navi_background_bottom : R.color.navi_text_secondary));
        }
    }

    private void setUpSearchField() {
        editSearchQuery.addTextChangedListener(new TextWatcher() {
            @Override
            public void beforeTextChanged(CharSequence s, int start, int count, int after) {
            }

            @Override
            public void onTextChanged(CharSequence s, int start, int before, int count) {
            }

            @Override
            public void afterTextChanged(Editable s) {
                applyFilters();
            }
        });
    }

    private void setUpBottomNav() {
        com.google.android.material.bottomnavigation.BottomNavigationView bottomNav = findViewById(R.id.bottomNav);
        bottomNav.setSelectedItemId(R.id.nav_search);
        bottomNav.setOnItemSelectedListener(item -> {
            // Wire each tab to its own Activity/Fragment as those screens are built.
            return true;
        });
    }

    private void applyFilters() {
        String query = editSearchQuery.getText().toString().trim().toLowerCase(Locale.getDefault());

        List<RoomItem> filtered = new ArrayList<>();
        for (RoomItem room : allRooms) {
            boolean matchesFilter = selectedFilter.equals("All")
                    || room.getCategory().getLabel().equalsIgnoreCase(selectedFilter);
            boolean matchesQuery = query.isEmpty()
                    || room.getName().toLowerCase(Locale.getDefault()).contains(query)
                    || room.getFloor().toLowerCase(Locale.getDefault()).contains(query);

            if (matchesFilter && matchesQuery) {
                filtered.add(room);
            }
        }

        roomAdapter.submitList(filtered);
        textResultsCount.setText(getString(R.string.results_found_format, filtered.size()));
    }

    private int dp(int value) {
        return (int) (value * getResources().getDisplayMetrics().density);
    }
}
