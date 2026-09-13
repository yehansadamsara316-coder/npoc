    // දින සැසඳීම සඳහා Helper Function එකක්
        function getFormattedDate(dateObj) {
            return dateObj.toISOString().split('T')[0]; // YYYY-MM-DD
        }

      async function loadOrders() {
    // LocalStorage වෙනුවට Supabase එකෙන් Data ලබා ගැනීම
    const { data: orders, error } = await _supabase
        .from('canteen_orders')
        .select('*')
        .order('id', { ascending: false });

    if (error) {
        console.error("Orders ලබාගැනීමේ දෝෂයක්:", error);
        return;
    }

    var todayBody = document.getElementById("today-orders-body");
    var yesterdayBody = document.getElementById("yesterday-orders-body");
    var foodSummaryBody = document.getElementById("food-summary-body");
    
    todayBody.innerHTML = "";
    yesterdayBody.innerHTML = "";
    foodSummaryBody.innerHTML = "";

    var totalIncome = 0;
    var pendingCount = 0;
    var foodCounts = {};

    var now = new Date();
    var todayStr = getFormattedDate(now);

    var yesterday = new Date(now);
    yesterday.setDate(now.getDate() - 1);
    var yesterdayStr = getFormattedDate(yesterday);

    var todayOrdersCount = 0;
    var yesterdayOrdersCount = 0;

    if (!orders || orders.length === 0) {
        todayBody.innerHTML = `<tr><td colspan="8" class="text-center text-muted">Orders කිසිවක් නොමැත.</td></tr>`;
        yesterdayBody.innerHTML = `<tr><td colspan="8" class="text-center text-muted">Orders කිසිවක් නොමැත.</td></tr>`;
        foodSummaryBody.innerHTML = `<tr><td colspan="2" class="text-center text-muted">පෙන්ඩින් Orders කිසිවක් නොමැත.</td></tr>`;
    } else {
        orders.forEach(function(order) {
            var priceNum = parseFloat(order.totalCash ? order.totalCash.replace("LKR ", "") : 0) || 0;
            totalIncome += priceNum;

            var orderDateStr = order.created_at ? order.created_at.split('T')[0] : todayStr;

            if(order.status === "Pending") {
                pendingCount++;
                if (orderDateStr === todayStr && order.foods) {
                    var itemsList = order.foods.split(",");
                    itemsList.forEach(function(item) {
                        var cleanItem = item.trim();
                        if (cleanItem) {
                            foodCounts[cleanItem] = (foodCounts[cleanItem] || 0) + 1;
                        }
                    });
                }
            }

            var badgeClass = order.status === "Completed" ? "badge-completed" : "badge-pending";

            var row = `
                <tr>
                    <td>
                        <strong class="text-danger" style="font-size: 1.1rem;"><i class="far fa-clock"></i> ${order.time}</strong>
                        <br><small class="text-muted">Placed: ${orderDateStr}</small>
                    </td>
                    <td><b>${order.name}</b></td>
                    <td><span class="badge badge-info">${order.methord}</span> <br>${order.grade || ''}</td>
                    <td><a href="tel:${order.phone}">${order.phone}</a></td>
                    <td><small>${order.foods}</small></td>
                    <td><b>${order.totalCash}</b></td>
                    <td><span class="badge ${badgeClass}">${order.status}</span></td>
                    <td>
                        <button class="btn btn-sm btn-success mb-1" onclick="markComplete(${order.id})" title="Mark Complete">✔ Done</button>
                        <button class="btn btn-sm btn-danger mb-1" onclick="deleteOrder(${order.id})" title="Delete">🗑 Delete</button>
                    </td>
                </tr>
            `;

            if (orderDateStr === todayStr) {
                todayBody.innerHTML += row;
                todayOrdersCount++;
            } else {
                yesterdayBody.innerHTML += row;
                yesterdayOrdersCount++;
            }
        });

        // Food Summary Rendering
        var foodKeys = Object.keys(foodCounts);
        if (foodKeys.length === 0) {
            foodSummaryBody.innerHTML = `<tr><td colspan="2" class="text-center text-muted">අද දින පෙන්ඩින් Orders කිසිවක් නොමැත.</td></tr>`;
        } else {
            foodKeys.forEach(function(foodName) {
                var summaryRow = `
                    <tr>
                        <td><b>${foodName}</b></td>
                        <td class="text-center"><span class="badge badge-food-count">${foodCounts[foodName]}</span></td>
                    </tr>
                `;
                foodSummaryBody.innerHTML += summaryRow;
            });
        }
    }

    document.getElementById("total-orders-count").innerText = orders.length;
    document.getElementById("pending-orders-count").innerText = pendingCount;
    document.getElementById("total-income").innerText = "LKR " + totalIncome.toFixed(2);
}

// Status වෙනස් කිරීම (Update)
async function markComplete(id) {
    const { error } = await _supabase
        .from('canteen_orders')
        .update({ status: 'Completed' })
        .eq('id', id);

    if (!error) loadOrders();
}

// Order එක ඉවත් කිරීම (Delete)
async function deleteOrder(id) {
    if (confirm("ඔබට මෙම Order එක ඉවත් කිරීමට අවශ්‍යද?")) {
        const { error } = await _supabase
            .from('canteen_orders')
            .delete()
            .eq('id', id);

        if (!error) loadOrders();
    }
}

                    var badgeClass = order.status === "Completed" ? "badge-completed" : "badge-pending";

                    var row = `
                        <tr>
                            <td>
                                <strong class="text-danger" style="font-size: 1.1rem;"><i class="far fa-clock"></i> ${order.time}</strong>
                                <br><small class="text-muted">Placed: ${order.date || ''}</small>
                            </td>
                            <td><b>${order.name}</b></td>
                            <td><span class="badge badge-info">${order.methord}</span> <br>${order.grade || ''}</td>
                            <td><a href="tel:${order.phone}">${order.phone}</a></td>
                            <td><small>${order.foods}</small></td>
                            <td><b>${order.totalCash}</b></td>
                            <td><span class="badge ${badgeClass}">${order.status}</span></td>
                            <td>
                                <button class="btn btn-sm btn-success mb-1" onclick="markComplete(${order.id})" title="Mark Complete">✔ Done</button>
                                <button class="btn btn-sm btn-danger mb-1" onclick="deleteOrder(${order.id})" title="Delete">🗑 Delete</button>
                            </td>
                        </tr>
                    `;

                    // අද සහ ඊයේ අනුව වෙන් කර Table වලට එකතු කිරීම
                    if (orderDateStr === todayStr) {
                        todayBody.innerHTML += row;
                        todayOrdersCount++;
                    } else if (orderDateStr === yesterdayStr) {
                        yesterdayBody.innerHTML += row;
                        yesterdayOrdersCount++;
                    }
                

                if (todayOrdersCount === 0) {
                    todayBody.innerHTML = `<tr><td colspan="8" class="text-center text-muted">අද දින Orders කිසිවක් නොමැත.</td></tr>`;
                }
                if (yesterdayOrdersCount === 0) {
                    yesterdayBody.innerHTML = `<tr><td colspan="8" class="text-center text-muted">ඊයේ දින Orders කිසිවක් නොමැත.</td></tr>`;
                }

                // Food Summary Render කිරීම
                var foodKeys = Object.keys(foodCounts);
                if (foodKeys.length === 0) {
                    foodSummaryBody.innerHTML = `<tr><td colspan="2" class="text-center text-muted">අද දින පෙන්ඩින් Orders කිසිවක් නොමැත.</td></tr>`;
                } else {
                    foodKeys.forEach(function(foodName) {
                        var summaryRow = `
                            <tr>
                                <td><b>${foodName}</b></td>
                                <td class="text-center"><span class="badge badge-food-count">${foodCounts[foodName]}</span></td>
                            </tr>
                        `;
                        foodSummaryBody.innerHTML += summaryRow;
                    });
                }
            

            // Dashboard Stats
            document.getElementById("total-orders-count").innerText = orders.length;
            document.getElementById("pending-orders-count").innerText = pendingCount;
            document.getElementById("total-income").innerText = "LKR " + totalIncome.toFixed(2);
        

    
         
        // 1. Supabase Client එක Initialize කිරීම
    const SUPABASE_URL = 'https://azzwynmjuuuxwyflujjo.supabase.co/rest/v1/';
    const SUPABASE_ANON_KEY = 'sb_publishable_KNa1UDWQTQ9qtkcGGDrIdQ_hLPNVXoe';
    const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

    // 2. Database එකෙන් Data ලබාගැනීම (Read)
    async function fetchData() {
      const { data, error } = await supabase
        .from('messages') // ඔයාගේ Table එකේ නම
        .select('*');

      if (error) {
        console.error('Data ලබාගැනීමේ දෝෂයක්:', error);
        return;
      }

      const list = document.getElementById('dataList');
      list.innerHTML = '';
      data.forEach(item => {
        const li = document.createElement('li');
        li.textContent = item.content;
        list.appendChild(li);
      });
    }

    // 3. Database එකට Data ඇතුළත් කිරීම (Insert)
    async function addData() {
      const input = document.getElementById('userInput');
      const text = input.value;

      if (!text) return;

      const { data, error } = await supabase
        .from('messages')
        .insert([{ content: text }]);

      if (error) {
        console.error('Data ඇතුළත් කිරීමේ දෝෂයක්:', error);
        alert('Save කිරීමට නොහැකි විය. RLS Rules පරික්ෂා කරන්න!');
      } else {
        input.value = '';
        fetchData(); // Data එකතු කළ පසු List එක Update කිරීම
      }
    }
    async function fetchOrders() {
    const tbody = document.getElementById('all-orders-body');
    
    const { data, error } = await _supabase
        .from('canteen_orders')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) {
        console.error("Error fetching orders:", error);
        tbody.innerHTML = `<tr><td colspan="9" class="text-danger text-center">Error loading orders: ${error.message}</td></tr>`;
        return;
    }

    if (!data || data.length === 0) {
        tbody.innerHTML = `<tr><td colspan="9" class="text-center">කිසිදු Order එකක් හමුවූයේ නැත.</td></tr>`;
        updateAnalytics([]);
        return;
    }

    let html = '';
    data.forEach(order => {
        const statusBadge = order.status === 'Completed' 
            ? `<span class="badge-completed">Completed</span>`
            : `<span class="badge-pending">Pending</span>`;

        // Automatically formatted date fallback to created_at if order_date is null
        const displayDate = order.order_date || (order.created_at ? order.created_at.split('T')[0] : 'N/A');

        html += `
            <tr>
                <td><span class="badge badge-secondary">${displayDate}</span></td> <!-- Displays Date -->
                <td><b>${order.time || 'N/A'}</b></td>
                <td>${order.name || '-'}</td>
                <td><span class="badge badge-info">${order.methord || ''}</span> ${order.grade || ''}</td>
                <td>${order.phone || '-'}</td>
                <td>${order.foods || '-'}</td>
                <td class="text-success font-weight-bold">${order.totalCash || 'LKR 0.00'}</td>
                <td>${statusBadge}</td>
                <td>
                    ${order.status !== 'Completed' ? `<button class="btn btn-sm btn-success mr-1" onclick="markCompleted('${order.id}')"><i class="fas fa-check"></i> Complete</button>` : ''}
                    <button class="btn btn-sm btn-danger" onclick="deleteOrder('${order.id}')"><i class="fas fa-trash"></i> Delete</button>
                </td>
            </tr>
        `;
    });

    tbody.innerHTML = html;
    updateAnalytics(data);
}

    // Page එක Load වන විටම Data ලබාගැනීම
    fetchData();
        

        setInterval(loadOrders, 5000);
        loadOrders();