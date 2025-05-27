import { useUserStore } from '../stores/userStore'
import { usePlatformStore } from '../stores/platformStore'
import { useDeliveryStore } from '../stores/deliveryStore'
import { useCollectionStore } from '../stores/collectionStore'
import { useExpensesStore } from '../stores/expensesStore'


export async function initAfterLogin() {
    const userStore = useUserStore()
    const platforms = usePlatformStore()
    const deliveries = useDeliveryStore()
    const collections = useCollectionStore()
    const expenses = useExpensesStore()


    await userStore.fetchUserData()
    await platforms.fetchPlataformas()
    await deliveries.fetchDeliveries()
    await collections.fetchCollections()
    await expenses.fetchExpenses()
}