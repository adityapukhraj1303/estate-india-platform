<div>
    <h3>Admin Dashboard Summary</h3>
    <div class="row">
        <div class="col-md-3">
            <div class="card bg-primary text-white mb-4">
                <div class="card-body">
                    <h5>Total Properties</h5>
                    <h2>{{ \App\Models\Property::count() }}</h2>
                </div>
            </div>
        </div>
        <div class="col-md-3">
            <div class="card bg-success text-white mb-4">
                <div class="card-body">
                    <h5>Total Orders</h5>
                    <h2>{{ \App\Models\Order::count() }}</h2>
                </div>
            </div>
        </div>
        <div class="col-md-3">
            <div class="card bg-info text-white mb-4">
                <div class="card-body">
                    <h5>Active Users</h5>
                    <h2>{{ \App\Models\User::count() }}</h2>
                </div>
            </div>
        </div>
        <div class="col-md-3">
            <div class="card bg-warning text-white mb-4">
                <div class="card-body">
                    <h5>Total Revenue</h5>
                    <h2>₹{{ number_index(\App\Models\Order::where('status', 'completed')->sum('total_amount')) }}</h2>
                </div>
            </div>
        </div>
    </div>
</div>
